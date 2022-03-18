import * as s from "superstruct";

export const invalidateForUserSchema = s.type({ userID: s.string() });
export const invalidateForRoomSchema = s.type({ roomID: s.string() });

export type InvalidateForUser = s.Infer<typeof invalidateForUserSchema>;
export type InvalidateForRoom = s.Infer<typeof invalidateForRoomSchema>;
