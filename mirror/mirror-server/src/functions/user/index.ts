import * as functions from 'firebase-functions/v2';
import {ensure as ensureHandler} from './ensure.function';

export const ensure = functions.https.onCall({cors: true}, ensureHandler);
