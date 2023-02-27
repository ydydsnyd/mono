import http from 'http';
import https from 'https';

export const request = (
  url: string,
  method = 'GET',
  headers: Record<string, string> = {},
  data?: string,
): Promise<{statusCode: number; body: string}> => {
  return new Promise(resolve => {
    const lib = new URL(url).protocol === 'http:' ? http : https;
    const req = lib.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      },
      res => {
        res.setEncoding('utf8');
        let responseStr = '';
        res.on('data', (chunk: Buffer) => {
          responseStr += chunk.toString();
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 500,
            body: responseStr,
          });
        });
      },
    );
    if (data) {
      req.write(data);
    }
    req.end();
  });
};

export class RequestError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export const post = async <T>(
  url: string,
  data: string,
  headers: Record<string, string> = {},
  noParse = false,
) => {
  const r = await request(url, 'POST', headers, data);
  if (r.statusCode === 200) {
    if (noParse) {
      return r.body as unknown as T;
    }
    return JSON.parse(r.body) as unknown as T;
  } else {
    throw new RequestError(r.statusCode, `Request to ${url} failed: ${r.body}`);
  }
};

export const get = async <T>(
  url: string,
  headers: Record<string, string> = {},
) => {
  const r = await request(url, 'GET', headers);
  if (r.statusCode === 200) {
    return JSON.parse(r.body) as unknown as T;
  } else {
    throw new RequestError(r.statusCode, `Request to ${url} failed: ${r.body}`);
  }
};
