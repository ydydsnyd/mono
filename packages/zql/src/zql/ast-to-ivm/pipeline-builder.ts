import {must} from 'shared/src/must.js';
import type {
  AST,
  Aggregation,
  Condition,
  HavingCondition,
  Join,
  Ordering,
  Selector,
  SimpleCondition,
  SimpleHavingCondition,
} from '../ast/ast.js';
import {DifferenceStream, concat} from '../ivm/graph/difference-stream.js';
import type {Source} from '../ivm/source/source.js';
import {getValueFromEntity} from '../ivm/source/util.js';
import type {PipelineEntity, StringOrNumber} from '../ivm/types.js';
import type {Entity} from '../schema/entity-schema.js';

export function pullUsedSources(ast: AST, ret: Set<string>): Set<string> {
  if (ast.table) {
    ret.add(ast.table);
  }
  if (ast.joins) {
    for (const join of ast.joins) {
      pullUsedSources(join.other, ret);
    }
  }
  return ret;
}

export function buildPipeline(
  sourceProvider: (
    sourceName: string,
    order: Ordering | undefined,
  ) => Source<PipelineEntity>,
  ast: AST,
  explode: boolean,
) {
  let {stream} = sourceProvider(
    must(ast.table, 'Table not specified in the AST'),
    ast.orderBy,
  );

  // TODO: start working on pipeline sharing so we don't have to
  // re-build the join index every time.
  if (ast.joins) {
    stream = applyJoins(sourceProvider, ast.table, stream, ast.joins, explode);
  }

  if (ast.where) {
    stream = applyWhere(stream, ast.where);
  }

  let ret: DifferenceStream<PipelineEntity> = stream;
  // groupBy also applies aggregations
  if (ast.groupBy) {
    ret = applyGroupBy(
      ret as DifferenceStream<PipelineEntity>,
      ast.groupBy,
      ast.aggregate ?? [],
      explode,
    ) as unknown as DifferenceStream<PipelineEntity>;
  }
  // if there was no group-by then we could be aggregating the entire table
  else if (ast.aggregate && ast.aggregate.length > 0) {
    ret = applyFullTableAggregation(
      ret as DifferenceStream<PipelineEntity>,
      ast.aggregate,
    );
  }

  if (ast.having) {
    ret = applyWhere(ret, ast.having);
  }

  if (ast.distinct) {
    ret = applyDistinct(ret, ast.distinct);
  }

  // Note: the stream is technically attached at this point.
  // We could detach it until the user actually runs (or subscribes to) the statement as a tiny optimization.
  return ret;
}

export function applyJoins<T extends PipelineEntity, O extends PipelineEntity>(
  sourceProvider: (
    sourceName: string,
    order: Ordering | undefined,
  ) => Source<PipelineEntity>,
  sourceTableOrAlias: string,
  stream: DifferenceStream<T>,
  joins: Join[],
  explode: boolean,
): DifferenceStream<O> {
  let ret: DifferenceStream<Entity> =
    stream as unknown as DifferenceStream<Entity>;
  for (const join of joins) {
    const bPipeline = buildPipeline(sourceProvider, join.other, explode);

    const aQualifiedColumn = join.on[0];
    const bQualifiedColumn = join.on[1];
    const joinArgs = {
      aTable: sourceTableOrAlias,
      aPrimaryKeyColumns: ['id'],
      aJoinColumn: aQualifiedColumn,

      b: bPipeline,
      bAs: join.as,
      bTable: join.other.table,
      // TODO(mlaw): either disallow joining against queries or test this for that case.
      bPrimaryKeyColumns: ['id'],
      bJoinColumn: bQualifiedColumn,
    } as const;
    switch (join.type) {
      case 'inner':
        ret = ret.join(joinArgs) as unknown as DifferenceStream<Entity>;
        break;
      case 'left':
        ret = ret.leftJoin(
          joinArgs,
          sourceProvider,
        ) as unknown as DifferenceStream<Entity>;
        break;
    }
  }
  return ret as unknown as DifferenceStream<O>;
}

function applyWhere<T extends PipelineEntity>(
  stream: DifferenceStream<T>,
  where: Condition | HavingCondition,
) {
  // We'll handle `OR` and parentheticals like so:
  // OR: We'll create a new stream for the LHS and RHS of the OR then merge together.
  // Parentheticals: We'll create a new stream for the LHS and RHS of the operator involved in combining the parenthetical then merge together.
  //
  // Example:
  // (a = 1 AND b = 2) OR (c = 3 AND d = 4)
  // Becomes
  //       s
  //      / \
  //    a=1 c=3
  //    /     \
  //    b=2   d=4
  //     \    /
  //       OR
  //        |
  //
  // So `ORs` cause a fork (two branches that need to be evaluated) and then that fork is combined.

  switch (where.op) {
    case 'AND':
      return applyAnd(stream, where.conditions);
    case 'OR':
      return applyOr(stream, where.conditions);
    default:
      return applySimpleCondition(stream, where);
  }
}

function applyAnd<T extends PipelineEntity>(
  stream: DifferenceStream<T>,
  conditions: (Condition | HavingCondition)[],
) {
  for (const condition of conditions) {
    stream = applyWhere(stream, condition);
  }
  return stream;
}

function applyOr<T extends PipelineEntity>(
  stream: DifferenceStream<T>,
  conditions: (Condition | HavingCondition)[],
): DifferenceStream<T> {
  // Or is done by branching the stream and then applying the conditions to each
  // branch. Then we merge the branches back together. At this point we need to
  // ensure we do not get duplicate entries so we add a distinct operator
  const branches = conditions.map(c => applyWhere(stream, c));
  return concat(branches).distinct();
}

function applySimpleCondition<T extends PipelineEntity>(
  stream: DifferenceStream<T>,
  condition: SimpleCondition | SimpleHavingCondition,
) {
  return stream.filter(condition.field, condition.op, condition.value.value);
}

function applyDistinct<T extends PipelineEntity>(
  stream: DifferenceStream<T>,
  column: Selector,
) {
  return stream.distinctAll(
    x => getValueFromEntity(x, column) as StringOrNumber,
  );
}

function applyGroupBy<T extends PipelineEntity>(
  stream: DifferenceStream<T>,
  columns: Selector[],
  aggregations: Aggregation[],
  explode: boolean,
) {
  const qualifiedColumns = aggregations.map(q =>
    q.field === undefined ? undefined : q.field,
  );

  return stream.reduce(
    columns,
    value => value.id as string,
    values => {
      const first = values[Symbol.iterator]().next().value;
      const ret: Record<string, unknown> = {...first};
      let contributors: PipelineEntity[] | undefined;
      let contributorSource: string | undefined;
      if (explode) {
        contributors = [];
      }

      for (let i = 0; i < aggregations.length; i++) {
        const aggregation = aggregations[i];
        const qualifiedColumn = qualifiedColumns[i];
        contributorSource = aggregation.field?.[0];
        switch (aggregation.aggregate) {
          case 'count': {
            let count = 0;
            for (const v of values) {
              contributors?.push(v);
              count++;
            }
            ret[aggregation.alias] = count;
            break;
          }
          case 'sum': {
            let sum = 0;
            for (const value of values) {
              contributors?.push(value);
              sum += (getValueFromEntity(value, must(qualifiedColumn)) ??
                0) as number;
            }
            ret[aggregation.alias] = sum;
            break;
          }
          case 'avg': {
            let sum = 0;
            let count = 0;
            for (const value of values) {
              contributors?.push(value);
              const v = getValueFromEntity(value, must(qualifiedColumn));
              if (v === undefined) {
                continue;
              }
              sum += v as number;
              count++;
            }
            ret[aggregation.alias] = sum / count;
            break;
          }
          case 'min': {
            let min;
            for (const value of values) {
              contributors?.push(value);
              const newValue = getValueFromEntity(
                value,
                must(qualifiedColumn),
              ) as number | string;
              if (newValue === undefined) {
                continue;
              }
              if (min === undefined || min === null || min > newValue) {
                min = newValue;
              }
            }
            ret[aggregation.alias] = min;
            break;
          }
          case 'max': {
            let max;
            for (const value of values) {
              contributors?.push(value);
              const newValue = getValueFromEntity(
                value,
                must(qualifiedColumn),
              ) as number | string;
              if (newValue === undefined) {
                continue;
              }
              if (max === undefined || max === null || max < newValue) {
                max = newValue;
              }
            }
            ret[aggregation.alias] = max;
            break;
          }
          case 'array': {
            const arr: unknown[] = [];
            for (const value of values) {
              contributors?.push(value);
              const extracted = getValueFromEntity(
                value,
                must(qualifiedColumn),
              );
              if (extracted !== undefined) {
                arr.push(extracted);
              }
            }
            ret[aggregation.alias] = arr;
            break;
          }
          default:
            throw new Error(`Unknown aggregation ${aggregation.aggregate}`);
        }
      }
      // THIS IS WRONG. We can have many aggregations on a single row!
      if (contributors) {
        ret.__source = contributorSource;
        ret.__source_rows = contributors;
      }
      return ret;
    },
  );
}

function applyFullTableAggregation<T extends PipelineEntity>(
  stream: DifferenceStream<T>,
  aggregations: Aggregation[],
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ret: DifferenceStream<any> = stream;
  for (const agg of aggregations) {
    switch (agg.aggregate) {
      case 'array':
      case 'min':
      case 'max':
        throw new Error(
          `${agg.aggregate} not yet supported outside of group-by`,
        );
      case 'avg':
        ret = ret.average(must(agg.field), agg.alias);
        break;
      case 'count':
        ret = ret.count(agg.alias);
        break;
      case 'sum':
        ret = ret.sum(must(agg.field), agg.alias);
        break;
    }
  }

  return ret;
}
