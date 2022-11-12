import type { BaseRoomDO } from "./room-do";
import {
  IttyRequest,
  IttyRouter,
  requireAuthAPIKeyMatches,
} from "./middleware";

type Route = {
  path: string;
  add: (
    router: IttyRouter,
    // TODO(fritz) what parameter should we use here?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roomDO: BaseRoomDO<any>,
    authApiKey: string | undefined
  ) => void;
};
const routes: Route[] = [];

// Note: paths may have router-style path parameters, e.g. /foo/:bar.
export function paths() {
  return routes.map((route) => route.path);
}

// Called by the roomDO to set up its routes.
export function addRoutes(
  router: IttyRouter,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roomDO: BaseRoomDO<any>,
  authApiKey: string | undefined
) {
  routes.forEach((route) => route.add(router, roomDO, authApiKey));
}

// Currently this deletePath is the same in the authDO and roomDO.
export const deletePath = "/api/room/v0/room/:roomID/delete";
routes.push({
  path: deletePath,
  add: (
    router: IttyRouter,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roomDO: BaseRoomDO<any>,
    authApiKey: string | undefined
  ) => {
    router.post(
      deletePath,
      requireAuthAPIKeyMatches(authApiKey),
      async (_: IttyRequest) => {
        // TODO should plumb a LogContext in here.
        return roomDO.deleteAllData();
      }
    );
  },
});
