import { createReflectServer } from "@rocicorp/reflect-server";
import { mutators } from "../shared/mutators";

const authHandler = async (auth: string) => {
  return {
    userID: auth,
  };
};

const { worker, RoomDO, AuthDO } = createReflectServer({
  mutators,
  authHandler,
  getLogLevel: () => "debug",
});
export { worker as default, RoomDO, AuthDO };
