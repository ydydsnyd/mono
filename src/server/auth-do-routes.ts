import type { BaseAuthDO } from "./auth-do";
import {
  IttyRequest,
  IttyRouter,
  requireAuthAPIKeyMatches,
} from "./middleware";

type Route = {
  path: string;
  add: (
    router: IttyRouter,
    authDO: BaseAuthDO,
    authApiKey: string | undefined
  ) => void;
};
const routes: Route[] = [];

// Note: paths may have router-style path parameters, e.g. /foo/:bar.
export function paths() {
  return routes.map((route) => route.path);
}

// Called by the authDO to set up its routes.
export function addRoutes(
  router: IttyRouter,
  authDO: BaseAuthDO,
  authApiKey: string | undefined
) {
  routes.forEach((route) => route.add(router, authDO, authApiKey));
}

// Note: we define the path and the handler in the same place like this
// so it's easy to understand what each route does.

export const roomStatusByRoomIDPath = "/api/v1/room/id/:roomID/status";
routes.push({
  path: roomStatusByRoomIDPath,
  add: (
    router: IttyRouter,
    authDO: BaseAuthDO,
    authApiKey: string | undefined
  ) => {
    router.get(
      roomStatusByRoomIDPath,
      requireAuthAPIKeyMatches(authApiKey),
      async (request: IttyRequest) => {
        return authDO.roomStatusByRoomID(request);
      }
    );
  },
});
