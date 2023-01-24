import {z} from 'zod';

// Keep this in sync with reflect client

// WebSocket close codes:
//
// 4000-4999
//
// Status codes in the range 4000-4999 are reserved for private use
// and thus can't be registered.  Such codes can be used by prior
// agreements between WebSocket applications.  The interpretation of
// these codes is undefined by this protocol.

export const enum ErrorKind {
  AuthInvalidated = 4000,
  ClientNotFound = 4001,
  InvalidConnectionRequest = 4002,
  InvalidMessage = 4003,
  RoomClosed = 4004,
  RoomNotFound = 4005,
  Unauthorized = 4006,
  UnexpectedBaseCookie = 4007,
  UnexpectedLastMutationID = 4008,
  Unknown = 4009,
}

const errorKindSchema = z.union([
  z.literal(ErrorKind.AuthInvalidated),
  z.literal(ErrorKind.ClientNotFound),
  z.literal(ErrorKind.InvalidConnectionRequest),
  z.literal(ErrorKind.InvalidMessage),
  z.literal(ErrorKind.RoomClosed),
  z.literal(ErrorKind.RoomNotFound),
  z.literal(ErrorKind.Unauthorized),
  z.literal(ErrorKind.UnexpectedBaseCookie),
  z.literal(ErrorKind.UnexpectedLastMutationID),
  z.literal(ErrorKind.Unknown),
]);

export function castToErrorKind(n: number): ErrorKind | undefined {
  return n >= 4000 && n <= ErrorKind.Unknown ? (n as ErrorKind) : undefined;
}

export function errorKindToString(kind: ErrorKind): string {
  switch (kind) {
    case ErrorKind.AuthInvalidated:
      return 'AuthInvalidated';
    case ErrorKind.ClientNotFound:
      return 'ClientNotFound';
    case ErrorKind.InvalidConnectionRequest:
      return 'InvalidConnectionRequest';
    case ErrorKind.InvalidMessage:
      return 'InvalidMessage';
    case ErrorKind.RoomClosed:
      return 'RoomClosed';
    case ErrorKind.RoomNotFound:
      return 'RoomNotFound';
    case ErrorKind.Unauthorized:
      return 'Unauthorized';
    case ErrorKind.UnexpectedBaseCookie:
      return 'UnexpectedBaseCookie';
    case ErrorKind.UnexpectedLastMutationID:
      return 'UnexpectedLastMutationID';
    case ErrorKind.Unknown:
      return 'Unknown';
  }
}

export const errorMessageSchema = z.tuple([
  z.literal('error'),
  errorKindSchema,
  z.string(),
]);

export type ErrorMessage = z.infer<typeof errorMessageSchema>;
