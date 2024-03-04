// fetch-mock has invalid d.ts file so we removed that on npm install.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import fetchMock from 'fetch-mock/esm/client';
import {callDefaultFetch} from './call-default-fetch.js';
import {expect} from 'chai';

test('209', async () => {
  fetchMock.post('http://test.com/pull', {body: {bar: 'baz'}, status: 209});

  const fetchResponse = await callDefaultFetch(
    'http://test.com/pull',
    'auth1',
    'requestID1',
    {
      foo: 'bar',
    },
  );

  expect(await fetchResponse[0]?.json()).deep.equal({bar: 'baz'});
  expect(fetchResponse[1]).deep.equal({httpStatusCode: 209, errorMessage: ''});
  expect(fetchMock.calls().length).equal(1);
  const fetchReq = fetchMock.calls()[0];
  expect(fetchReq[0]).equal('http://test.com/pull');
  const fetchReqOpts = fetchReq[1];
  expect(fetchReqOpts.method).equal('POST');
  expect(fetchReqOpts.headers['content-type']).equal('application/json');
  expect(fetchReqOpts.headers['authorization']).equal('auth1');
  expect(fetchReqOpts.headers['x-replicache-requestid']).equal('requestID1');
  const body = await fetchReq.request.json();
  expect(body).deep.equal({foo: 'bar'});
  fetchMock.restore();
});

test('400', async () => {
  fetchMock.post('http://test.com/pull2', {body: {}, status: 400});
  const fetchResponse2 = await callDefaultFetch(
    'http://test.com/pull2',
    'auth',
    'requestID',
    {
      foo: 'bar',
    },
  );
  expect(fetchResponse2[0]).equal(undefined);
  expect(fetchResponse2[1]).deep.equal({
    httpStatusCode: 400,
    errorMessage: '{}',
  });
  fetchMock.restore();
});
