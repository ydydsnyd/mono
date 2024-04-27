import {jsonSchema} from 'shared/out/json-schema.js';
import * as v from 'shared/out/valita.js';
import {entityIDSchema} from './entity.js';

const putOpSchema = v.object({
  op: v.literal('put'),
  entityType: v.string(),
  entityID: entityIDSchema,
  value: jsonSchema,
});

const delOpSchema = v.object({
  op: v.literal('del'),
  entityType: v.string(),
  entityID: entityIDSchema,
});

const clearOpSchema = v.object({
  op: v.literal('clear'),
});

const patchOpSchema = v.union(putOpSchema, delOpSchema, clearOpSchema);

export const entitiesPatchSchema = v.array(patchOpSchema);
export type EntitiesPutOp = v.Infer<typeof putOpSchema>;
export type EntitiesDelOp = v.Infer<typeof delOpSchema>;
export type EntitiesClearOp = v.Infer<typeof clearOpSchema>;
export type EntitiesPatchOp = v.Infer<typeof patchOpSchema>;
export type EntitiesPatch = v.Infer<typeof entitiesPatchSchema>;
