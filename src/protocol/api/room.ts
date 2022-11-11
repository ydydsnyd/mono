import * as s from "superstruct";

export const createRoomRequestSchema = s.type({
  roomID: s.string(),
  requireEUStorage: s.boolean(),
});

export type CreateRoomRequest = s.Infer<typeof createRoomRequestSchema>;
