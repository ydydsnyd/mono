import {test, expect} from '@jest/globals';
import {https} from 'firebase-functions/v2';
import {ensure} from './ensure.function.js';

import type {DecodedIdToken} from 'firebase-admin/auth';
import type {Request} from 'firebase-functions/v2/https';

import {firebaseStub} from 'firestore-jest-mock/mocks/firebase.js';
import type {Firestore} from 'firebase-admin/firestore';

const mockFirebaseInstance = firebaseStub({
  database: {
    users: [{id: 'foo', name: 'Homer Simpson', roles: {fooTeam: 'a'}}],
  },
});

test('creates user doc', async () => {
  const firestore = mockFirebaseInstance.firestore();
  const ensureFunction = https.onCall(
    ensure(firestore as unknown as Firestore),
  );

  const resp = await ensureFunction.run({
    data: {
      requester: {
        userID: 'foo',
        userAgent: {type: 'reflect-cli', version: '0.0.1'},
      },
    },
    auth: {
      uid: 'foo',
      token: {email: 'foo@bar.com'} as DecodedIdToken,
    },
    rawRequest: null as unknown as Request,
  });
  expect(resp).toEqual({success: true});
  const fooDoc = await firestore.doc('users/foo').get();
  expect(fooDoc.exists).toBe(true);
  expect(fooDoc.data).toEqual({
    email: 'foo@bar.com',
    roles: {},
  });
});

test('rejects auth without email', async () => {
  const firestore = mockFirebaseInstance.firestore();
  const ensureFunction = https.onCall(
    ensure(firestore as unknown as Firestore),
  );

  let error = undefined;
  try {
    await ensureFunction.run({
      data: {
        requester: {
          userID: 'foo',
          userAgent: {type: 'reflect-cli', version: '0.0.1'},
        },
      },
      auth: {
        uid: 'foo',
        token: {
          /* no email field */
        } as DecodedIdToken,
      },
      rawRequest: null as unknown as Request,
    });
  } catch (e) {
    error = e;
  }
  expect(error).not.toBeUndefined;
  expect(String(error)).toBe('Authenticated user must have an email address');
  const fooDoc = await firestore.doc('users/foo').get();
  expect(fooDoc.exists).toBe(false);
});

test('does not overwrite existing user doc', async () => {
  const firestore = mockFirebaseInstance.firestore();
  const ensureFunction = https.onCall(
    ensure(firestore as unknown as Firestore),
  );

  await firestore.doc('users/foo').update({
    email: 'foo@bar.com',
    name: 'Foo Bar',
    roles: {fooTeam: 'a'},
  });

  const resp = await ensureFunction.run({
    data: {
      requester: {
        userID: 'foo',
        userAgent: {type: 'reflect-cli', version: '0.0.1'},
      },
    },
    auth: {
      uid: 'foo',
      token: {email: 'foo@bar.com'} as DecodedIdToken,
    },
    rawRequest: null as unknown as Request,
  });
  expect(resp).toEqual({success: true});
  const fooDoc = await firestore.doc('users/foo').get();
  expect(fooDoc.exists).toBe(true);
  expect(fooDoc.data).toEqual({
    email: 'foo@bar.com',
    name: 'Foo Bar',
    roles: {fooTeam: 'a'},
  });
});
