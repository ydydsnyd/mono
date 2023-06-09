import {https} from 'firebase-functions/v2';
import {initializeApp} from 'firebase-admin/app';
import {functionsConfig} from './functions-config.js';
import {publish as publishHandler} from './functions/publish.function.js';
import {healthcheck as healthcheckHandler} from './functions/healthcheck.function.js';
import * as userFunctions from './functions/user/index.js';
import {getFirestore} from 'firebase-admin/firestore';

// Initializes firestore et al. (e.g. for subsequent calls to getFirestore())
initializeApp();

export const publish = https.onRequest(
  {cors: functionsConfig.allowlist},
  publishHandler,
);
export const healthcheck = https.onRequest(
  {cors: functionsConfig.allowlist},
  healthcheckHandler,
);

// Per https://firebase.google.com/docs/functions/manage-functions
// functions should be deployed in groups of 10 or fewer
// Best practice is to organize the functions by grouping them
// into separate logical groups and exporting each group here.
// Then deployment should take place on a group by group basis
// or deploy individual updated functions
export const user = {
  ensure: https.onCall(
    {cors: functionsConfig.whitelist},
    userFunctions.ensure(getFirestore()),
  ),
};
