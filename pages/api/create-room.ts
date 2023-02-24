import type {VercelRequest, VercelResponse} from '@vercel/node';
import {post} from './lib/request';
import {SERVICE_HOST} from '@/demo/shared/urls';

const reflectApiKey = process.env.REFLECT_AUTH_API_KEY || '';

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

  const headers = {'x-reflect-auth-api-key': reflectApiKey};

  console.log(`Creating room via ${`${SERVICE_HOST}/createRoom`}...`);

  try {
    const body = await post<string>(
      `${SERVICE_HOST}/createRoom`,
      JSON.stringify({roomID}),
      headers,
      true,
    );
    res.json(body);
  } catch (e) {
    console.error(e);
    res.status(500).send(`error: ${String(e)}`);
  }
};

export default handler;
