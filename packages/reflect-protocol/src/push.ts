import * as v from 'shared/src/valita.js';
import {jsonSchema} from './json.js';

const mutationSchemaBase = {
  id: v.number(),
  clientID: v.string(),
  name: v.string(),
  timestamp: v.number(),
};

const mutationV1Schema = v.object({
  ...mutationSchemaBase,
  args: jsonSchema,
});

const mutationV2Schema = v.object({
  ...mutationSchemaBase,
  args: v.array(jsonSchema),
});

const pushBodySchemaBase = {
  clientGroupID: v.string(),
  requestID: v.string(),
  schemaVersion: v.string(),
  timestamp: v.number(),
};

const pushBodyV1Schema = v.object({
  pushVersion: v.literal(1), // keep this first to make runtime type checking faster?
  mutations: v.array(mutationV1Schema),
  ...pushBodySchemaBase,
});

const pushBodyV2Schema = v.object({
  pushVersion: v.literal(2), // keep this first to make runtime type checking faster?
  mutations: v.array(mutationV2Schema),
  ...pushBodySchemaBase,
});

const pushBodySchema = v.union(pushBodyV2Schema, pushBodyV1Schema);

export const pushMessageSchema = v.tuple([v.literal('push'), pushBodySchema]);

type PushBodyV1 = v.Infer<typeof pushBodyV1Schema>;
type PushBodyV2 = v.Infer<typeof pushBodyV2Schema>;
export type PushBody = PushBodyV1 | PushBodyV2;

export type PushMessage = v.Infer<typeof pushMessageSchema>;

export type MutationV1 = v.Infer<typeof mutationV1Schema>;
export type MutationV2 = v.Infer<typeof mutationV2Schema>;
export type Mutation = MutationV1 | MutationV2;
