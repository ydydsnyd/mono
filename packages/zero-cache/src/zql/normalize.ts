import {ident} from 'pg-format';
import type {JSONValue} from 'postgres';
import {assert} from 'shared/src/asserts.js';
import {
  Aggregate,
  normalizeAST,
  Selector,
  type Condition,
} from 'zql/src/zql/ast/ast.js';
import {create64} from '../types/xxhash.js';
import type {ServerAST} from './server-ast.js';

export type ParameterizedQuery = {
  query: string;
  values: JSONValue[];
};

/**
 * @returns An object for producing normalized version of the supplied `ast`,
 *     the resulting parameterized query, and hash identifier.
 */
export function getNormalized(ast: ServerAST): Normalized {
  return new Normalized(ast);
}

function aggFn(agg: Aggregate) {
  return agg === 'array' ? 'array_agg' : agg;
}

export class Normalized {
  readonly #ast: ServerAST;
  readonly #values: JSONValue[] = [];
  readonly #query;
  #nextParam = 1;

  constructor(ast: ServerAST) {
    // Normalize the AST such that all order-agnostic lists (basically, everything
    // except ORDER BY) are sorted in a deterministic manner such that semantically
    // equivalent ASTs produce the same queries and hash identifier.
    this.#ast = normalizeServerAST(ast);

    assert(this.#ast.select?.length || this.#ast.aggregate?.length);

    this.#query = this.#constructQuery(this.#ast);
  }

  #constructQuery(ast: ServerAST): string {
    const {
      schema,
      table,
      alias,
      subQuery,
      select,
      aggregate,
      joins,
      groupBy,
      orderBy,
      limit,
      where,
    } = ast;

    let query = '';
    const selection = [
      ...(select ?? []).map(
        ([sel, alias]) => `${selector(sel)} AS ${ident(alias)}`,
      ),
      ...(aggregate ?? []).map(a => {
        // Aggregation aliases are ignored for normalization, and instead aliased
        // to the string representation of the aggregation, e.g.
        // 'SELECT COUNT(foo) AS "COUNT(foo)" WHERE ...'
        const agg = `${aggFn(a.aggregate)}(${
          a.field ? selector(a.field) : '*'
        })`;
        return `${agg} AS ${ident(agg)}`;
      }),
    ].join(', ');

    if (selection) {
      query += `SELECT ${selection} FROM `;
    }

    if (subQuery) {
      // At the moment, only a single subquery is supported, and it overrides the
      // `table` field. Currently these are only produced by the transformation code.
      const {ast, alias} = subQuery;
      assert(ast.table === table);
      query += `(${this.#constructQuery(ast)}) AS ${ident(alias)}`;
    } else {
      if (schema) {
        query += ident(schema) + '.';
      }
      query += ident(table);
      if (alias) {
        query += ` AS ${ident(alias)}`;
      }
    }

    joins?.forEach(join => {
      const {
        type,
        other,
        on: [left, right],
        as,
      } = join;
      query += ` ${type.toUpperCase()} JOIN `;
      const joinFrom = this.#constructQuery(other);
      query += other.select ? `(${joinFrom})` : joinFrom;
      query += ` AS ${ident(as)} ON ${selector(left)} = ${selector(right)}`;
    });
    if (where) {
      query += ` WHERE ${this.#condition(where)}`;
    }
    if (groupBy) {
      query += ` GROUP BY ${groupBy.map(x => selector(x)).join(', ')}`;
    }
    if (orderBy) {
      query += ` ORDER BY ${orderBy
        .map(([x, dir]) => `${selector(x)} ${dir}`)
        .join(', ')}`;
    }
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    return query;
  }

  #condition(cond: Condition): string {
    if (cond.type === 'simple') {
      const {
        value: {type, value},
      } = cond;
      assert(type === 'value');
      if (!Array.isArray(value)) {
        this.#values.push(value);
        return `${selector(cond.field)} ${cond.op} $${this.#nextParam++}`;
      }
      // Unroll the array
      let expr = `${selector(cond.field)} ${cond.op} (`;
      value.forEach((v, i) => {
        this.#values.push(v);
        expr += (i ? ', ' : '') + `$${this.#nextParam++}`;
      });
      expr += ')';
      return expr;
    }

    return `(${cond.conditions
      .map(sub => `${this.#condition(sub)}`)
      .join(` ${cond.op} `)})`;
  }

  /** @returns The normalized AST. */
  ast(): ServerAST {
    return this.#ast;
  }

  /**
   * @returns the parameterized `query` with parameter `values`,
   *    suitable for `PREPARE` and `EXECUTE` postgresql commands, respectively.
   */
  query(): ParameterizedQuery {
    return {query: this.#query, values: [...this.#values]};
  }

  /**
   * @returns hash representing the normalized AST, which is the same for all semantically
   *    equivalent ASTs.
   */
  hash(radix = 36): string {
    return create64(SEED)
      .update(this.#query)
      .update(JSON.stringify(this.#values))
      .digest()
      .toString(radix);
  }
}

function selector(selector: Selector): string {
  const [table, column] = selector;
  const ids = [table.split('.'), column].flat();
  return ids.map(id => ident(id)).join('.');
}

const SEED = 0x34567890n;

function normalizeServerAST(ast: ServerAST): ServerAST {
  const {subQuery} = ast;
  return {
    ...normalizeAST(ast),
    subQuery: subQuery
      ? {
          ...subQuery,
          ast: normalizeServerAST(subQuery.ast),
        }
      : undefined,
  };
}
