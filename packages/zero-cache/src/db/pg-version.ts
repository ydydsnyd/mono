import type postgres from 'postgres';

export const PG_V14 = 140000;
export const PG_V15 = 150000;

// e.g. 160003 (for PG v16.3)
export async function getPgVersion(db: postgres.Sql): Promise<number> {
  const [{version}] = await db<{version: number}[]>`
      SELECT current_setting('server_version_num')::int4 as "version"`;
  return version;
}
export function v15plus(pgVersion: number): boolean {
  return pgVersion >= PG_V15;
}
