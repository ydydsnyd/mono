import type {ReadonlyJSONObject} from 'replicache';

export type AuthReason =
  | {
      type: 'initial';
    }
  | {
      type: 'invalidated'; // connection was invalidated via rest api
    }
  | {
      type: 'authFailure';
      cause?: ReadonlyJSONObject; // cause returned by authHandler
    }
  | {
      type: 'error';
      error:
        | 'missingAuth' // server was configured with an authHandler but client options has undefined auth
        | 'userIDMismatch' // userId returned by authHandler did not equal client options userID
        | 'missingAuth or userIDMismatch';
    };
