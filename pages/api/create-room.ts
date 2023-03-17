import type {VercelRequest, VercelResponse} from '@vercel/node';
import {get, post, RequestError} from './lib/request';
import {SERVICE_HOST} from '@/demo/shared/urls';

const ROOM_STATUS_URL = (roomID: string) =>
  `${SERVICE_HOST}/api/room/v0/room/${roomID}/status`;
const CREATE_ROOM_URL = () => `${SERVICE_HOST}/createRoom`; // TODO: move to `${SERVICE_HOST}/api/room/v0/room/create` when upgrading reflect-server;

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.status(204).end();
    return;
  }
  const {roomID} = req.body as unknown as {roomID: string};

  if (!roomID) {
    console.log(`Invalid request: ${req}`);
    res.status(406).send('Invalid request');
    return;
  }
  const reflectApiKey = process.env.REFLECT_AUTH_API_KEY;
  if (!reflectApiKey) {
    res.status(401).send('REFLECT_AUTH_API_KEY not set.');
    return;
  }

  const headers = {'x-reflect-auth-api-key': reflectApiKey};

  console.log(
    `Checking if room ${roomID} already exists via ${ROOM_STATUS_URL(roomID)}`,
  );

  try {
    const {status} = await get<{status: string}>(
      ROOM_STATUS_URL(roomID),
      headers,
    );
    if (status === 'open') {
      res.status(204).end();
      return;
    }
  } catch (err) {
    const e = err as RequestError;
    console.error(e);
    res.status(e.code).send(`${String(e)}`);
    return;
  }

  console.log(`Creating room via ${CREATE_ROOM_URL()}...`);

  try {
    const body = await post<string>(
      CREATE_ROOM_URL(),
      JSON.stringify({roomID}),
      headers,
      true,
    );
    res.status(201).json(body);
  } catch (err) {
    const e = err as RequestError;
    console.error(e);
    res.status(e.code).send(`${String(e)}`);
  }
};

export default handler;
