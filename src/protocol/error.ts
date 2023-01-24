import * as s from 'superstruct';

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

const errorKindSchema = s.union([
  s.literal(ErrorKind.AuthInvalidated),
  s.literal(ErrorKind.ClientNotFound),
  s.literal(ErrorKind.InvalidConnectionRequest),
  s.literal(ErrorKind.InvalidMessage),
  s.literal(ErrorKind.RoomClosed),
  s.literal(ErrorKind.RoomNotFound),
  s.literal(ErrorKind.Unauthorized),
  s.literal(ErrorKind.UnexpectedBaseCookie),
  s.literal(ErrorKind.UnexpectedLastMutationID),
  s.literal(ErrorKind.Unknown),
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

export const errorMessageSchema = s.tuple([
  s.literal('error'),
  errorKindSchema,
  s.string(),
]);

export type ErrorMessage = s.Infer<typeof errorMessageSchema>;
