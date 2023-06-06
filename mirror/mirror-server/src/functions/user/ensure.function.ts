import {withSchema} from '../validators/schema';
import {
  ensureUserRequestSchema,
  ensureUserResponseSchema,
} from 'mirror-protocol';

export const ensure = withSchema(
  ensureUserRequestSchema,
  ensureUserResponseSchema,
  async req => req,
);
