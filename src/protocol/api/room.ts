import * as s from "superstruct";

export const createRoomRequestSchema = s.type({ roomID: s.string() });

export type CreateRoomRequest = s.Infer<typeof createRoomRequestSchema>;
