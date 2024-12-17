import {assert} from '../../../shared/src/asserts.js';
import {must} from '../../../shared/src/must.js';
import type {AST} from '../../../zero-protocol/src/ast.js';
import {gatherCorrelatedSubqueryQueriesFromCondition} from '../builder/builder.js';
import {SUBQ_PREFIX} from '../query/query-impl.js';

/**
 * We have a much more complete and complex covering algorithm sketched out in the design docs.
 * This is an implementation that only handles the simplest of cases.
 *
 * The designed algorithm can determine if many existing queries taken together
 * cover a new query.
 *
 * It can also handle limits, where clauses, divergent subqueries, and more.
 */
type Table = string;
type QueryHash = string;

export function findCover(
  existingQueries: Map<Table, Map<QueryHash, {normalized: AST}>>,
  query: AST,
): {hash: QueryHash; query: AST} | undefined {
  for (const [hash, candidate] of existingQueries.get(query.table) ?? []) {
    if (covers(candidate.normalized, query)) {
      return {hash, query: candidate.normalized};
    }
  }

  return undefined;
}

export function covers(cover: AST, query: AST) {
  return (
    cover.table === query.table &&
    cover.where === undefined &&
    cover.limit === undefined &&
    coversRelationships(cover, query)
  );
}

function coversRelationships(cover: AST, query: AST): boolean {
  const coverSubqueries = pullSubqueries(cover);
  const subqueries = pullSubqueries(query);

  function getCoversSubquery(alias: string) {
    return (
      coverSubqueries.get(alias) ??
      coverSubqueries.get(SUBQ_PREFIX + alias) ??
      coverSubqueries.get(alias.substring(SUBQ_PREFIX.length))
    );
  }

  // Make sure the cover has all the same (or more) subqueries.
  for (const alias of subqueries.keys()) {
    if (getCoversSubquery(alias) === undefined) {
      return false;
    }
  }

  // Make sure each subquery covers the corresponding subquery.
  for (const [alias, subquery] of subqueries) {
    const coverSubquery = must(getCoversSubquery(alias));
    if (!covers(coverSubquery, subquery)) {
      return false;
    }
  }

  return true;
}

function pullSubqueries(query: AST) {
  return new Map([
    ...(query.related?.map(
      r => [must(r.subquery.alias), r.subquery] as const,
    ) ?? []),
    ...gatherCorrelatedSubqueryQueriesFromCondition(query.where).map(
      csq => [must(csq.subquery.alias), csq.subquery] as const,
    ),
  ]);
}
