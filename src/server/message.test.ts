import { test, expect } from "@jest/globals";
import type { PushBody } from "../../src/protocol/push.js";
import type { ClientMap } from "../../src/types/client-state.js";
import { Mocket, mutation } from "../util/test-utils.js";
import { handleMessage } from "../../src/server/message.js";
import { LogContext } from "../../src/util/logger.js";

test("handleMessage", async () => {
  type Case = {
    name: string;
    data: string;
    expectedError?: string;
    expectedPush?: PushBody;
  };

  const cases: Case[] = [
    {
      name: "empty",
      data: "",
      expectedError: "SyntaxError: Unexpected end of JSON input",
    },
    {
      name: "invalid push",
      data: "[]",
      expectedError: "Should have at least 2 items",
    },
    {
      name: "valid push",
      data: JSON.stringify([
        "push",
        {
          mutations: [mutation(1), mutation(2)],
          pushVersion: 1,
          schemaVersion: "",
        },
      ]),
      expectedPush: {
        mutations: [mutation(1), mutation(2)],
        pushVersion: 1,
        schemaVersion: "",
        timestamp: 42,
      },
    },
  ];

  for (const c of cases) {
    const clients: ClientMap = new Map();
    const clientID = "c1";
    const s1 = new Mocket();
    // let called = false;

    // const handlePush = (
    //   // pClients: ClientMap,
    //   pClientID: ClientID,
    //   pBody: PushBody,
    //   pWS: Socket
    // ) => {
    //   expect(pClientID).toEqual(clientID);
    //   expect(pBody).toEqual(c.expectedPush);
    //   expect(pWS).toEqual(s1);
    //   called = true;
    // };
    handleMessage(
      new LogContext("info"),
      clients,
      clientID,
      c.data,
      s1,
      () => undefined
    );
    if (c.expectedError) {
      expect(s1.log.length).toEqual(1);
      const [type, message] = s1.log[0];
      expect(type).toEqual("send");
      expect(message).toContain(c.expectedError);
    } else {
      // expect(called);
    }
  }
});
