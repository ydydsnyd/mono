import {
  errorReportingRequestSchema,
  errorReportingResponseSchema,
} from 'mirror-protocol/src/error.js';
import {HttpsError} from 'firebase-functions/v2/https';

import {validateSchema} from '../validators/schema.js';

export const report = () =>
  validateSchema(
    errorReportingRequestSchema,
    errorReportingResponseSchema,
  ).handle((request, _context) => {
    const {
      action,
      error: {desc},
    } = request;

    let {severity} = request;

    const ROCI_TEAM_USERIDS = [
      'Dplw09NbNaWMVFLAoKYlTbJXuha2', // cesar
      '02Yam8WlcQfC3lf7Rf803e9eoWp2', // aaron
      'IrSbtZGlYGfLKYpiwYLiISdZ7Hl2', // greg
      'Sr0S3VOyqIN9O06nMACgwqQ3GvK2', // alex
      'fH958LU8qyMmfVrfTzE0egkxsHk1', // erik
      'hu0ggohMptVpC4GRn6GhfN9dhcO2', // darick
    ];

    if (ROCI_TEAM_USERIDS.includes(request.requester.userID)) {
      severity = 'WARNING';
    }
    // 4xx and 5xx errors have different alerting thresholds.
    // "cancelled" maps to 499 and "unknown" maps to 500
    throw new HttpsError(
      severity === 'WARNING' ? 'cancelled' : 'unknown',
      `action: ${action}, description: ${desc}`,
    );
  });
