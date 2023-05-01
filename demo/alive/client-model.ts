import {z} from 'zod';
import {entitySchema, generate, Update} from '@rocicorp/rails';
import type {ReadTransaction, WriteTransaction} from '@rocicorp/reflect';

const botControllerKey = 'botControllerKey';
const botControllerSchema = z.object({
  clientID: z.string(),
});
export type BotControllerModel = z.infer<typeof botControllerSchema>;

export const getBotController = async (
  tx: ReadTransaction,
): Promise<BotControllerModel | undefined> => {
  const botController = await tx.get(botControllerKey);
  return botController === undefined
    ? botController
    : botControllerSchema.parse(botController);
};
const setBotController = async (
  tx: WriteTransaction,
  value: BotControllerModel,
) => {
  return tx.put(botControllerKey, value);
};

const deleteBotController = async (tx: WriteTransaction) => {
  return tx.del(botControllerKey);
};

export const clientModelSchema = entitySchema.extend({
  selectedPieceID: z.string(),
  x: z.number(),
  y: z.number(),
  color: z.string(),
  location: z.union([z.string(), z.null()]),
  // If non-empty, this client is a bot controlled
  // by the client with this id.
  botControllerID: z.string(),
});

// Export generated interface.
export type ClientModel = z.infer<typeof clientModelSchema>;
export type ClientModelUpdate = Update<ClientModel>;
const clientGenerateResult = generate('client', clientModelSchema);

export const {
  get: getClient,
  has: hasClient,
  update: updateClient,
  list: listClients,
} = clientGenerateResult;

export const deleteClient = async (tx: WriteTransaction, id: string) => {
  let botController = await getBotController(tx);
  if (tx.environment === 'server') {
    if (botController?.clientID === id) {
      const clients = await listClients(tx);
      // Delete all bots
      let newBotControllerClient = undefined;
      for (const client of clients) {
        if (client.id !== id && client.botControllerID === '') {
          newBotControllerClient = client;
        }
        if (client.botControllerID) {
          await clientGenerateResult.delete(tx, client.id);
        }
      }
      // Set new bot controller.
      if (newBotControllerClient) {
        await setBotController(tx, {clientID: newBotControllerClient.id});
      } else {
        await deleteBotController(tx);
      }
    }
  }
  await clientGenerateResult.delete(tx, id);
};

// export const updateClient = async (
//   tx: WriteTransaction,
//   value: ClientModel,
// ) => {
//   let botController = await getBotController(tx);
//   const client = await getClient(tx, value.id);
//   if (tx.environment === 'server') {
//     if (
//       botController === undefined &&
//       client &&
//       client.botControllerID === ''
//     ) {
//       botController = {clientID: value.id};
//       await setBotController(tx, botController);
//     }
//   }
//   if (
//     client &&
//     client.botControllerID &&
//     (client.botControllerID !== tx.clientID ||
//       !botController ||
//       botController.clientID !== client.botControllerID)
//   ) {
//     return;
//   }
//   await clientGenerateResult.update(tx, value);
// };

export const putClient = async (tx: WriteTransaction, value: ClientModel) => {
  let botController = await getBotController(tx);
  if (tx.environment === 'server') {
    if (botController === undefined) {
      botController = {clientID: tx.clientID};
      await setBotController(tx, botController);
    }
  }
  // if (
  //   value.botControllerID &&
  //   value.botControllerID !== botController?.clientID
  // ) {
  //   return;
  // }
  await clientGenerateResult.put(tx, value);
};
