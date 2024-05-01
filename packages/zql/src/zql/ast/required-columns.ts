import {assert} from 'shared/src/asserts.js';
import type {AST, Condition} from './ast.js';

// TODO: deal with *....
// We need runtime schema information to deal with that :(
export function getRequiredColumns(ast: AST) {
  const maybeAliased = new Map<string, Set<string>>();
  const dealiased = new Map<string, Set<string>>();

  for (const selector of [
    ...(ast.select ?? []),
    ...(ast.groupBy ?? []),
    ...(ast.orderBy?.[0] ? [ast.orderBy[0]] : []),
    ...walkConditions(ast.where),
    ...(ast.aggregate
      ?.flatMap(x => x.field)
      .filter((x): x is string => x !== undefined) ?? []),
    ...(ast.joins ?? []).flatMap(x => [x.on[0], x.on[1]]),
    // skip having on purpose (only operates on aggregates)
  ]) {
    const [table, column] = selectorToQualifiedColumn(
      Array.isArray(selector) ? selector[0] : selector,
    );
    if (column === 'id' && table === undefined) {
      continue;
    }
    assert(
      table !== undefined,
      `table must be defined for selector ${selector}`,
    );

    let existing = maybeAliased.get(table);
    if (!existing) {
      existing = new Set();
      maybeAliased.set(table, existing);
    }
    existing.add(column);
  }

  const aliases = new Map<string, string>();
  for (const join of ast.joins ?? []) {
    if (join.as && join.as !== join.other.table) {
      aliases.set(join.as, join.other.table);
    }
  }
  for (const [aliasOrTable, columns] of maybeAliased.entries()) {
    const table = aliases.get(aliasOrTable) ?? aliasOrTable;
    let existing = dealiased.get(table);
    if (!existing) {
      existing = new Set();
      dealiased.set(table, existing);
    }
    for (const column of columns) {
      existing.add(column);
    }
  }

  return dealiased;
}

export function selectorsToQualifiedColumns(
  selectors: string[],
): (readonly [string | undefined, string])[] {
  return selectors.map(selectorToQualifiedColumn);
}

export function selectorToQualifiedColumn(
  x: string,
): readonly [string | undefined, string] {
  if (x.includes('.')) {
    return x.split('.') as [string, string];
  }
  return [undefined, x];
}

function walkConditions(conditions: Condition | undefined): string[] {
  if (conditions === undefined) {
    return [];
  }
  if (conditions.type === 'simple') {
    return [conditions.field];
  }
  return conditions.conditions.flatMap(walkConditions);
}
