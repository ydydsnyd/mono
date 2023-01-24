import {z} from 'zod';
import {expect} from '@esm-bundle/chai';
import {
  castToErrorKind,
  errorKindSchema,
  errorKindToString,
  NumericErrorKind,
} from './error.js';

test('errorKindToString', () => {
  const t = (k: NumericErrorKind, s: string) =>
    expect(errorKindToString(k)).equal(s);

  t(NumericErrorKind.AuthInvalidated, 'AuthInvalidated');
  t(NumericErrorKind.ClientNotFound, 'ClientNotFound');
  t(NumericErrorKind.InvalidConnectionRequest, 'InvalidConnectionRequest');
  t(NumericErrorKind.InvalidMessage, 'InvalidMessage');
  t(NumericErrorKind.RoomClosed, 'RoomClosed');
  t(NumericErrorKind.RoomNotFound, 'RoomNotFound');
  t(NumericErrorKind.Unauthorized, 'Unauthorized');
  t(NumericErrorKind.UnexpectedBaseCookie, 'UnexpectedBaseCookie');
  t(NumericErrorKind.UnexpectedLastMutationID, 'UnexpectedLastMutationID');
});

test('castToErrorKind', () => {
  const t = (n: number, k: NumericErrorKind | undefined) =>
    expect(castToErrorKind(n)).equal(k);

  t(3999, undefined);
  t(4000, NumericErrorKind.AuthInvalidated);
  t(4001, NumericErrorKind.ClientNotFound);
  t(4002, NumericErrorKind.InvalidConnectionRequest);
  t(4003, NumericErrorKind.InvalidMessage);
  t(4004, NumericErrorKind.RoomClosed);
  t(4005, NumericErrorKind.RoomNotFound);
  t(4006, NumericErrorKind.Unauthorized);
  t(4007, NumericErrorKind.UnexpectedBaseCookie);
  t(4008, NumericErrorKind.UnexpectedLastMutationID);
  t(4009, undefined);
});

test('errorKindSchema', () => {
  const t = (k: NumericErrorKind) => expect(errorKindSchema.parse(k)).equal(k);

  t(NumericErrorKind.AuthInvalidated);
  t(NumericErrorKind.ClientNotFound);
  t(NumericErrorKind.InvalidConnectionRequest);
  t(NumericErrorKind.InvalidMessage);
  t(NumericErrorKind.RoomClosed);
  t(NumericErrorKind.RoomNotFound);
  t(NumericErrorKind.Unauthorized);
  t(NumericErrorKind.UnexpectedBaseCookie);
  t(NumericErrorKind.UnexpectedLastMutationID);

  expect(() => errorKindSchema.parse(3999)).throw(z.ZodError);
  expect(() => errorKindSchema.parse(4009)).throw(z.ZodError);
});
