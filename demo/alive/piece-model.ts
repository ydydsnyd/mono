import {z} from 'zod';
import {entitySchema, generate, Update} from '@rocicorp/rails';

// Note, we use the stringified index inside PIECE_DEFINITIONS (aka the "piece num") as the ID.
export const pieceModelSchema = entitySchema.extend({
  x: z.number(),
  y: z.number(),
  rotation: z.number(),
  placed: z.boolean(),
});

// Export generated interface.
export type PieceModel = z.infer<typeof pieceModelSchema>;
export type PieceModelUpdate = Update<PieceModel>;
export const {
  put: putPiece,
  get: getPiece,
  update: updatePiece,
  list: listPieces,
} = generate('piece', pieceModelSchema);
