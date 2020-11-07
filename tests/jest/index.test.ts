import fetchMock from 'jest-fetch-mock';
import { fetcher, getRequestBody, getResponseBody } from '../../src/index';
import { composeMiddleware } from '../../src/middlewares/middleware';

const path = 'http://app.acmec.com';

describe('getResponseBody', () => {
  it('formats the response as json', async () => {
    const body = JSON.stringify({ hello: 'world' });
    const response = new Response(body, {
      headers: new Headers([['Content-Type', 'application/json']]),
    });
    const data = await getResponseBody(response);
    expect(data).toEqual({ hello: 'world' });
  });

  it('formats the response as text', async () => {
    const response = new Response('something', {
      headers: new Headers([['Content-Type', 'application/text']]),
    });
    const data = await getResponseBody(response);
    expect(data).toBe('something');
  });
});

describe('getRequestBody', () => {
  it('formats an string body', () => {
    expect(getRequestBody('helloworld')).toBe('helloworld');
  });

  it('ignores undefined body', () => {
    expect(getRequestBody(undefined)).toBe(undefined);
  });

  it('formats the object body to string', () => {
    const expected = JSON.stringify({
      hello: 'world',
    });
    expect(
      getRequestBody({
        hello: 'world',
      })
    ).toBe(expected);
  });

  it('returns blob body as it is', () => {
    const blob = new Blob();
    expect(getRequestBody(blob)).toBe(blob);
  });
});

describe('fetcher', () => {
  afterEach(() => fetchMock.resetMocks());

  describe('calling the fetch client', () => {
    it('using the global client', async () => {
      const client = fetcher();

      await client(path);

      // @ts-ignore
      expect(fetchMock.mock.calls[0][0].method).toEqual('GET');
    });

    it('using the provided client', async () => {
      const fetchSpy = jest.fn();
      const client = fetcher({ fetch: fetchSpy });

      await client(path);

      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  it('calls the middleware', async () => {
    const middleware = jest.fn((next) => next);
    const client = fetcher({ middleware: composeMiddleware(middleware) });

    await client(path);

    expect(middleware).toBeCalled();
  });
});
