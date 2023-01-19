import * as s from 'superstruct';

// Keep this in sync with reflect client

export const errorKindSchema = s.enums([
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

export type ErrorKind = s.Infer<typeof errorKindSchema>;

export const errorMessageSchema = s.tuple([
  s.literal('error'),
  errorKindSchema,
  s.string(),
]);

export type ErrorMessage = s.Infer<typeof errorMessageSchema>;
