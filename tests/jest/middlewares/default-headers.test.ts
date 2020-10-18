import fetchMock from 'jest-fetch-mock';
import { fetcher } from '../../../src/index';
import { defaultHeaders } from '../../../src/middlewares/default-headers';

describe('.json', () => {
  const client = fetcher({
    middleware: defaultHeaders({
      Else: '123',
      Something: '123',
    }),
  });
  const path = 'http://app.acmec.com';

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('sets the json headers', async () => {
    await client(path);
    expect(fetchMock.mock.calls[0][0].headers.get('Else')).toBe('123');
    expect(fetchMock.mock.calls[0][0].headers.get('Something')).toBe('123');
  });
});
