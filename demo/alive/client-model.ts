import {z} from 'zod';
import {entitySchema, generate, Update} from '@rocicorp/rails';

export const clientModelSchema = entitySchema.extend({
  selectedPieceID: z.string(),
  x: z.number(),
  y: z.number(),
  color: z.string(),
});

// Export generated interface.
export type ClientModel = z.infer<typeof clientModelSchema>;
export type ClientModelUpdate = Update<ClientModel>;
export const {
  put: putClient,
  get: getClient,
  delete: deleteClient,
  update: updateClient,
  list: listClients,
} = generate('client', clientModelSchema);
