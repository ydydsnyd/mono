import type {Firestore, DocumentReference} from 'firebase-admin/firestore';
import {withSchema} from '../validators/schema';
import {withAuthorization} from '../validators/auth';
import type {AsyncCallable} from '../validators/types';
import {
  EnsureUserRequest,
  EnsureUserResponse,
  ensureUserRequestSchema,
  ensureUserResponseSchema,
} from 'mirror-protocol/user.js';
import {userPath, User} from 'mirror-schema/user.js';
import {HttpsError} from 'firebase-functions/v2/https';

export function ensure(
  firestore: Firestore,
): AsyncCallable<EnsureUserRequest, EnsureUserResponse> {
  return withSchema(
    ensureUserRequestSchema,
    ensureUserResponseSchema,
    withAuthorization(async (ensureUserRequest, context) => {
      const {
        requester: {userID},
      } = ensureUserRequest;
      const userDocRef = firestore.doc(
        userPath(userID),
      ) as DocumentReference<User>;
      await firestore.runTransaction(async txn => {
        const userDoc = await txn.get(userDocRef);
        if (userDoc.exists) {
          return;
        }
        const email = context.auth?.token?.email;
        if (!email) {
          throw new HttpsError(
            'failed-precondition',
            'Authenticated user must have an email address',
          );
        }
        // A new User is not part of any teams. They are associated with a Team:
        // - When creating a new App (i.e `reflect init`).
        // - When invited to join a Team (future feature).
        txn.create(userDocRef, {email, roles: {}});
      });
      return {success: true};
    }),
  );
}
