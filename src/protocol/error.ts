import {z} from 'zod';

// Keep this in sync with reflect client

export const enum ErrorKind {
  AuthInvalidated = 'AuthInvalidated',
  ClientNotFound = 'ClientNotFound',
  InvalidConnectionRequest = 'InvalidConnectionRequest',
  InvalidMessage = 'InvalidMessage',
  RoomClosed = 'RoomClosed',
  RoomNotFound = 'RoomNotFound',
  Unauthorized = 'Unauthorized',
  UnexpectedBaseCookie = 'UnexpectedBaseCookie',
  UnexpectedLastMutationID = 'UnexpectedLastMutationID',
}

export const errorKindSchema = z.union([
  z.literal(ErrorKind.AuthInvalidated),
  z.literal(ErrorKind.ClientNotFound),
  z.literal(ErrorKind.InvalidConnectionRequest),
  z.literal(ErrorKind.InvalidMessage),
  z.literal(ErrorKind.RoomClosed),
  z.literal(ErrorKind.RoomNotFound),
  z.literal(ErrorKind.Unauthorized),
  z.literal(ErrorKind.UnexpectedBaseCookie),
  z.literal(ErrorKind.UnexpectedLastMutationID),
]);

export const errorMessageSchema = z.tuple([
  z.literal('error'),
  errorKindSchema,
  z.string(),
]);

export type ErrorMessage = ['error', ErrorKind, string];
