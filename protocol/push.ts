import { z } from "zod";
import { jsonSchema } from "./json";

export const mutationSchema = z.object({
  id: z.number(),
  name: z.string(),
  args: jsonSchema,
});

export const pushBodySchema = z.object({
  id: z.string(),
  mutations: z.array(mutationSchema),
  pushVersion: z.number(),
  schemaVersion: z.string(),
});

export const pushMessageSchema = z.tuple([z.literal("push"), pushBodySchema]);

export type Mutation = z.infer<typeof mutationSchema>;
export type PushBody = z.infer<typeof pushBodySchema>;
export type PushMessage = z.infer<typeof pushMessageSchema>;
