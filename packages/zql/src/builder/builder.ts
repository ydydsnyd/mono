import {assert} from '../../../shared/src/asserts.js';
import type {JSONValue} from '../../../shared/src/json.js';
import {must} from '../../../shared/src/must.js';
import type {
  AST,
  Condition,
  Conjunction,
  CorrelatedSubQuery,
  CorrelatedSubQueryCondition,
  Disjunction,
  LiteralValue,
  Ordering,
  Parameter,
  SimpleCondition,
  ValuePosition,
} from '../../../zero-protocol/src/ast.js';
import type {Row} from '../../../zero-protocol/src/data.js';
import type {PrimaryKey} from '../../../zero-protocol/src/primary-key.js';
import {Exists} from '../ivm/exists.js';
import {FanIn} from '../ivm/fan-in.js';
import {FanOut} from '../ivm/fan-out.js';
import {Filter} from '../ivm/filter.js';
import {Join} from '../ivm/join.js';
import type {Input, Storage} from '../ivm/operator.js';
import {Skip} from '../ivm/skip.js';
import type {Source} from '../ivm/source.js';
import {Take} from '../ivm/take.js';
import {MissingParameterError} from './error.js';
import {createPredicate} from './filter.js';

export type StaticQueryParameters = {
  authData: Record<string, JSONValue>;
  preMutationRow: Row | undefined;
};

/**
 * Interface required of caller to buildPipeline. Connects to constructed
 * pipeline to delegate environment to provide sources and storage.
 */
export interface BuilderDelegate {
  /**
   * Called once for each source needed by the AST.
   * Might be called multiple times with same tableName. It is OK to return
   * same storage instance in that case.
   */
  getSource(tableName: string): Source | undefined;

  /**
   * Called once for each operator that requires storage. Should return a new
   * unique storage object for each call.
   */
  createStorage(): Storage;
}

/**
 * Builds a pipeline from an AST. Caller must provide a delegate to create source
 * and storage interfaces as necessary.
 *
 * Usage:
 *
 * ```ts
 * class MySink implements Output {
 *   readonly #input: Input;
 *
 *   constructor(input: Input) {
 *     this.#input = input;
 *     this.#input.setOutput(this);
 *   }
 *
 *   push(change: Change, _: Operator) {
 *     console.log(change);
 *   }
 * }
 *
 * const input = buildPipeline(ast, myDelegate);
 * const sink = new MySink(input);
 * ```
 */
export function buildPipeline(
  ast: AST,
  delegate: BuilderDelegate,
  staticQueryParameters: StaticQueryParameters | undefined,
): Input {
  return buildPipelineInternal(
    bindStaticParameters(ast, staticQueryParameters),
    delegate,
    staticQueryParameters,
  );
}

export function bindStaticParameters(
  ast: AST,
  staticQueryParameters: StaticQueryParameters | undefined,
) {
  const visit = (node: AST): AST => {
    if (node.where) {
      return {
        ...node,
        where: bindCondition(node.where),
        related: node.related?.map(sq => ({
          ...sq,
          subquery: visit(sq.subquery),
        })),
      };
    }
    return node;
  };

  function bindCondition(condition: Condition): Condition {
    if (condition.type === 'simple') {
      return {
        ...condition,
        value: bindValue(condition.value),
      };
    }
    if (condition.type === 'correlatedSubQuery') {
      return {
        ...condition,
        related: {
          ...condition.related,
          subquery: visit(condition.related.subquery),
        },
      };
    }
    return {
      ...condition,
      conditions: condition.conditions.map(bindCondition),
    };
  }

  const bindValue = (value: ValuePosition): LiteralValue => {
    if (isParameter(value)) {
      const anchor = must(
        staticQueryParameters,
        'Static query params do not exist',
      )[value.anchor];
      assert(anchor !== undefined, `Missing parameter: ${value.anchor}`);
      const resolvedValue = anchor[value.field];
      // eslint-disable-next-line eqeqeq
      if (resolvedValue == null) {
        throw new MissingParameterError();
      }
      return resolvedValue as LiteralValue;
    }
    return value;
  };

  return visit(ast);
}

function isParameter(value: unknown): value is Parameter {
  return typeof value === 'object' && value !== null && 'type' in value;
}

function buildPipelineInternal(
  ast: AST,
  delegate: BuilderDelegate,
  staticQueryParameters: StaticQueryParameters | undefined,
  partitionKey?: string | undefined,
): Input {
  const source = delegate.getSource(ast.table);
  if (!source) {
    throw new Error(`Source not found: ${ast.table}`);
  }
  const conn = source.connect(must(ast.orderBy), ast.where);
  let end: Input = conn;
  const {appliedFilters} = conn;

  if (ast.start) {
    end = new Skip(end, ast.start);
  }

  const correlatedSubQueryConditions = gatherCorrelatedSubQueryConditions(
    ast.where,
  );

  for (const csqc of correlatedSubQueryConditions) {
    let csq = csqc.related;
    if (
      csqc.condition.type === 'EXISTS' ||
      csqc.condition.type === 'NOT EXISTS'
    ) {
      csq = {...csq, subquery: {...csq.subquery, limit: EXISTS_LIMIT}};
    }
    end = applyCorrelatedSubQuery(csq, delegate, staticQueryParameters, end);
  }

  if (ast.where) {
    end = applyWhere(end, ast.where, appliedFilters, delegate);
  }

  if (ast.limit) {
    end = new Take(end, delegate.createStorage(), ast.limit, partitionKey);
  }

  if (ast.related) {
    for (const sq of ast.related) {
      end = applyCorrelatedSubQuery(sq, delegate, staticQueryParameters, end);
    }
  }

  return end;
}

function applyCorrelatedSubQuery(
  sq: CorrelatedSubQuery,
  delegate: BuilderDelegate,
  staticQueryParameters: StaticQueryParameters | undefined,
  end: Input,
) {
  assert(sq.subquery.alias, 'Subquery must have an alias');
  const child = buildPipelineInternal(
    sq.subquery,
    delegate,
    staticQueryParameters,
    sq.correlation.childField,
  );
  end = new Join({
    parent: end,
    child,
    storage: delegate.createStorage(),
    parentKey: sq.correlation.parentField,
    childKey: sq.correlation.childField,
    relationshipName: sq.subquery.alias,
    hidden: sq.hidden ?? false,
  });
  return end;
}

function applyWhere(
  input: Input,
  condition: Condition,
  // Remove `appliedFilter`
  // Each branch can `fetch` with different filters from the same source.
  // Or we do the union of queries approach and retain this `appliedFilters` and `sourceConnect` behavior.
  // Downside of that being unbounded memory usage.
  appliedFilters: boolean,
  delegate: BuilderDelegate,
): Input {
  switch (condition.type) {
    case 'and':
      return applyAnd(input, condition, appliedFilters, delegate);
    case 'or':
      return applyOr(input, condition, appliedFilters, delegate);
    case 'correlatedSubQuery':
      return applyCorrelatedSubqueryCondition(input, condition, delegate);
    default:
      return applySimpleCondition(input, condition, appliedFilters);
  }
}

function applyAnd(
  input: Input,
  condition: Conjunction,
  appliedFilters: boolean,
  delegate: BuilderDelegate,
) {
  for (const subCondition of condition.conditions) {
    input = applyWhere(input, subCondition, appliedFilters, delegate);
  }
  return input;
}

function applyOr(
  input: Input,
  condition: Disjunction,
  appliedFilters: boolean,
  delegate: BuilderDelegate,
): Input {
  const fanOut = new FanOut(input);
  const branches: Input[] = [];
  for (const subCondition of condition.conditions) {
    branches.push(applyWhere(fanOut, subCondition, appliedFilters, delegate));
  }
  assert(branches.length > 0, 'Or condition must have at least one branch');
  return new FanIn(fanOut, branches as [Input, ...Input[]]);
}

function applySimpleCondition(
  input: Input,
  condition: SimpleCondition,
  appliedFilters: boolean,
): Input {
  return new Filter(
    input,
    appliedFilters ? 'push-only' : 'all',
    createPredicate(condition),
  );
}

export function assertOrderingIncludesPK(
  ordering: Ordering,
  pk: PrimaryKey,
): void {
  const orderingFields = ordering.map(([field]) => field);
  const missingFields = pk.filter(pkField => !orderingFields.includes(pkField));

  if (missingFields.length > 0) {
    throw new Error(
      `Ordering must include all primary key fields. Missing: ${missingFields.join(
        ', ',
      )}. ZQL automatically appends primary key fields to the ordering if they are missing 
      so a common cause of this error is a casing mismatch between Postgres and ZQL.
      E.g., "userid" vs "userID".
      You may want to add double-quotes around your Postgres column names to prevent Postgres from lower-casing them:
      https://www.postgresql.org/docs/current/sql-syntax-lexical.htm`,
    );
  }
}
function applyCorrelatedSubqueryCondition(
  input: Input,
  condition: CorrelatedSubQueryCondition,
  delegate: BuilderDelegate,
): Input {
  assert(
    condition.condition.type === 'EXISTS' ||
      condition.condition.type === 'NOT EXISTS',
  );
  return new Exists(
    input,
    delegate.createStorage(),
    must(condition.related.subquery.alias),
    condition.condition.type,
  );
}

function gatherCorrelatedSubQueryConditions(condition: Condition | undefined) {
  const correlatedSubQueryConditions: CorrelatedSubQueryCondition[] = [];
  const gather = (condition: Condition) => {
    if (condition.type === 'correlatedSubQuery') {
      correlatedSubQueryConditions.push(condition);
      return;
    }
    if (condition.type === 'and' || condition.type === 'or') {
      for (const c of condition.conditions) {
        gather(c);
      }
      return;
    }
  };
  if (condition) {
    gather(condition);
  }
  return correlatedSubQueryConditions;
}

const EXISTS_LIMIT = 5;
