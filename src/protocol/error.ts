import {z} from 'zod';

// Keep this in sync with reflect-server

export const errorKindSchema = z.enum([
  'AuthInvalidated',
  'ClientNotFound',
  'InvalidConnectionRequest',
  'InvalidMessage',
  'RoomClosed',
  'RoomNotFound',
  'Unauthorized',
  'UnexpectedBaseCookie',
  'UnexpectedLastMutationID',
  'Unknown',
]);

export type ErrorKind = z.infer<typeof errorKindSchema>;

export const errorMessageSchema = z.tuple([
  z.literal('error'),
  errorKindSchema,
  z.string(),
]);

export type ErrorMessage = z.infer<typeof errorMessageSchema>;
