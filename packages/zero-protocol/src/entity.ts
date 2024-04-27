import * as v from 'shared/out/valita.js';

/*
 * attribute name => value
 * Single entry models simple primary keys.
 * Multiple entries models composite primary keys.
 */
export const entityIDSchema = v.record(v.string());

export type EntityID = v.Infer<typeof entityIDSchema>;
