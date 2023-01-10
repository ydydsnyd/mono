import {test, expect} from '@jest/globals';
import {LogContext} from '@rocicorp/logger';
import type {ReadonlyJSONValue} from 'replicache';
import {createSilentLogContext} from '../util/test-utils.js';
import {
  asJSON,
  checkAuthAPIKey,
  get,
  Handler,
  makeRouted,
  post,
  requireAuthAPIKey,
  Routed,
  Router,
  withRoomID,
} from './router.js';

test('Router', async () => {
  const router = new Router();
  router.register(
    '/foo/:id',
    req =>
      new Response(`foo:${req.parsedURL.pathname.groups.id}`, {
        status: 200,
      }),
  );
  router.register(
    '/bar/:id',
    req =>
      new Response(`bar:${req.parsedURL.pathname.groups.id}`, {
        status: 400,
      }),
  );
  router.register(
    '/bar',
    () =>
      new Response(`bar`, {
        status: 500,
      }),
  );

  type Case = {
    path: string;
    expectedError?: string;
    expectedResponseCode: number | undefined;
    expectedResponseText: string | undefined;
  };

  const cases: Case[] = [
    {
      path: '/foo/42',
      expectedError: undefined,
      expectedResponseCode: 200,
      expectedResponseText: 'foo:42',
    },
    {
      path: '/bar/44',
      expectedError: undefined,
      expectedResponseCode: 400,
      expectedResponseText: 'bar:44',
    },
    {
      path: '/bar',
      expectedError: undefined,
      expectedResponseCode: 500,
      expectedResponseText: 'bar',
    },
    {
      path: '/monkey/nuts',
      expectedError: undefined,
      expectedResponseCode: undefined,
      expectedResponseText: undefined,
    },
  ];
  for (const c of cases) {
    let error: unknown;
    let resp: Response | undefined;
    try {
      resp = await router.dispatch(
        new Request(`https://test.roci.dev${c.path}`),
        createSilentLogContext(),
      );
    } catch (e) {
      error = e;
    }
    if (c.expectedError === undefined) {
      expect(error).toBeUndefined();
    } else {
      expect(String(error)).toMatch(c.expectedError);
    }
    expect(resp?.status).toEqual(c.expectedResponseCode);
    expect(await resp?.text()).toEqual(c.expectedResponseText);
  }
});

test('requireMethod', async () => {
  const getHandler = get(req => new Response(`${req.url}`, {status: 300}));
  const postHandler = post(
    async req => new Response(`${req.url}:${await req.text()}`, {status: 301}),
  );

  const pattern = new URLPattern();
  const url = 'https://test.roci.dev/';
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const parsedURL = pattern.exec(url)!;

  type Case = {
    handler: Handler<Routed, Response>;
    method: string;
    expectedStatus: number;
    expectedText: string;
  };

  const cases: Case[] = [
    {
      handler: getHandler,
      method: 'GET',
      expectedStatus: 300,
      expectedText: url,
    },
    {
      handler: getHandler,
      method: 'POST',
      expectedStatus: 405,
      expectedText: 'unsupported method',
    },
    {
      handler: postHandler,
      method: 'POST',
      expectedStatus: 301,
      expectedText: `${url}:ok`,
    },
    {
      handler: postHandler,
      method: 'GET',
      expectedStatus: 405,
      expectedText: 'unsupported method',
    },
  ];

  const lc = createSilentLogContext();

  for (const c of cases) {
    const req = new Request(url, {
      method: c.method,
      body: c.method === 'POST' ? 'ok' : undefined,
    });
    makeRouted(req, parsedURL, lc);

    const resp = await c.handler(req);
    expect(resp.status).toBe(c.expectedStatus);
    expect(await resp.text()).toBe(c.expectedText);
  }
});

test('checkAuthAPIKey', async () => {
  type Case = {
    required: string;
    actual: string | null;
    expected:
      | {error: string}
      | {result: {text: string; status: number}}
      | undefined;
  };

  const cases: Case[] = [
    {
      required: '',
      actual: null,
      expected: {
        error: 'Error: Internal error: expected auth api key cannot be empty',
      },
    },
    {
      required: '',
      actual: '',
      expected: {
        error: 'Error: Internal error: expected auth api key cannot be empty',
      },
    },
    {
      required: '',
      actual: 'foo',
      expected: {
        error: 'Error: Internal error: expected auth api key cannot be empty',
      },
    },
    {
      required: 'foo',
      actual: null,
      expected: {result: {text: 'unauthorized', status: 401}},
    },
    {
      required: 'foo',
      actual: '',
      expected: {result: {text: 'unauthorized', status: 401}},
    },
    {
      required: 'foo',
      actual: 'bar',
      expected: {result: {text: 'unauthorized', status: 401}},
    },
    {
      required: 'foo',
      actual: 'foo',
      expected: undefined,
    },
  ];

  for (const c of cases) {
    const headers: Record<string, string> = {};
    if (c.actual !== null) {
      headers['x-reflect-auth-api-key'] = c.actual;
    }

    let result: Case['expected'];

    try {
      const response = checkAuthAPIKey(
        c.required,
        new Request('https://roci.dev/', {
          headers,
        }),
      );
      if (response === undefined) {
        result = response;
      } else {
        result = {
          result: {status: response.status, text: await response.text()},
        };
      }
    } catch (e) {
      result = {error: String(e)};
    }

    expect(result).toEqual(c.expected);
  }
});

test('requireAuthAPIKey', async () => {
  type Case = {
    required: string;
    actual: string | null;
    expected: {error: string} | {result: {text: string; status: number}};
  };

  const cases: Case[] = [
    {
      required: '',
      actual: null,
      expected: {
        error: 'Error: Internal error: expected auth api key cannot be empty',
      },
    },
    {
      required: '',
      actual: '',
      expected: {
        error: 'Error: Internal error: expected auth api key cannot be empty',
      },
    },
    {
      required: '',
      actual: 'foo',
      expected: {
        error: 'Error: Internal error: expected auth api key cannot be empty',
      },
    },
    {
      required: 'foo',
      actual: null,
      expected: {result: {text: 'unauthorized', status: 401}},
    },
    {
      required: 'foo',
      actual: '',
      expected: {result: {text: 'unauthorized', status: 401}},
    },
    {
      required: 'foo',
      actual: 'bar',
      expected: {result: {text: 'unauthorized', status: 401}},
    },
    {
      required: 'foo',
      actual: 'foo',
      expected: {result: {text: 'ok', status: 200}},
    },
  ];

  for (const c of cases) {
    const headers: Record<string, string> = {};
    if (c.actual !== null) {
      headers['x-reflect-auth-api-key'] = c.actual;
    }

    let result: Case['expected'] | undefined = undefined;

    const handler = requireAuthAPIKey(
      () => c.required,
      async req => new Response(await req.text(), {status: 200}),
    );

    const req = new Request('https://roci.dev/', {
      method: 'POST',
      body: 'ok',
      headers,
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    makeRouted(req, new URLPattern().exec()!, new LogContext('debug'));
    try {
      const response = await handler(req);
      if (response === undefined) {
        result = response;
      } else {
        result = {
          result: {status: response.status, text: await response.text()},
        };
      }
    } catch (e) {
      result = {error: String(e)};
    }

    expect(result).toEqual(c.expected);
  }
});

test('withRoomID', async () => {
  type Case = {
    parsedURL: URLPatternURLPatternResult;
    expected: {result: {text: string; status: number}} | {error: string};
  };

  const cases: Case[] = [
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parsedURL: new URLPattern({pathname: '/room/:roomID'}).exec(
        'https://roci.dev/room/monkey',
      )!,
      expected: {result: {text: 'roomID:monkey', status: 200}},
    },
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parsedURL: new URLPattern({pathname: '/room/:otherThing'}).exec(
        'https://roci.dev/room/monkey',
      )!,
      expected: {
        error: 'Error: Internal error: roomID not found by withRoomID',
      },
    },
  ];

  const handler = withRoomID(
    req => new Response(`roomID:${req.roomID}`, {status: 200}),
  );

  for (const c of cases) {
    const url = `https://roci.dev/`;
    const request = new Request(url);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    makeRouted(request, c.parsedURL, createSilentLogContext());

    let result: Case['expected'] | undefined = undefined;
    try {
      const response = await handler(request);
      result = {result: {status: response.status, text: await response.text()}};
    } catch (e) {
      result = {error: String(e)};
    }

    expect(result).toEqual(c.expected);
  }
});

test('asJSON', async () => {
  type Case = {
    input: string;
    expected: ReadonlyJSONValue;
  };

  const cases: Case[] = [
    {
      input: 'bar',
      expected: {
        foo: 'bar',
      },
    },
    {
      input: 'monkey',
      expected: {
        foo: 'monkey',
      },
    },
  ];

  for (const c of cases) {
    const handler = asJSON(async req => ({
      foo: await req.text(),
    }));
    const request = new Request('http://roci.dev/', {
      method: 'POST',
      body: c.input,
    });
    makeRouted(
      request,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      new URLPattern().exec('https://roci.dev/')!,
      createSilentLogContext(),
    );
    const response = await handler(request);
    expect(await response.json()).toEqual(c.expected);
  }
});
