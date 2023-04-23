import type {PieceModel} from './piece-model';

// Synced model + derived/runtime state.
export type PieceInfo = PieceModel & {
  // The client currently selecting this piece, if any.
  selector: string | null;
};
