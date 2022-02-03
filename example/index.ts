import type { JSONValue, WriteTransaction } from "replicache";
import { Server as BaseServer } from "../src/index.js";
export { worker as default } from "../src/index.js";

const mutators = {
  async addData(tx: WriteTransaction, object: { [key: string]: JSONValue }) {
    for (const [key, value] of Object.entries(object)) {
      await tx.put(key, value);
    }
  },
};

type M = typeof mutators;

export class Server extends BaseServer<M> {
  constructor(state: DurableObjectState) {
    super(mutators, state);
  }
}
