import { compose, Dispatch, Middleware } from './middlewares/middleware';
import { asNativeRequest, HttpRequest } from './request';

export type Fetch = typeof fetch;
export type Path = string;

export interface ClientConfiguration {
  middleware?: Middleware<any>;
  fetch?: Fetch;
}

function dispatcher(client: Fetch = fetch): Dispatch<Response> {
  return (request: HttpRequest) => client(asNativeRequest(request));
}

export function withDefaults(request: Partial<HttpRequest>): Partial<HttpRequest> {
  return {
    context: {},
    credentials: 'same-origin',
    headers: new Headers(),
    mode: 'same-origin',
    ...request,
  };
}

export type Fetcher<T = Response> = (path: string, options?: Partial<HttpRequest>) => Promise<T>;

export function fetcher<T = unknown>(opts: ClientConfiguration = {}): Fetcher<T> {
  const dispatchRequest = dispatcher(opts.fetch);

  const dispatch = opts.middleware ? opts.middleware(dispatchRequest) : dispatchRequest;

  const executeRequest = compose(dispatch, withDefaults);

  return (path: Path, options: Partial<Omit<HttpRequest, 'url'>> = {}) => {
    return executeRequest({
      ...options,
      url: path,
    });
  };
}

function isString(val: any): val is string {
  return typeof val === 'string';
}

function isBlob(value: any): value is Blob {
  return value instanceof Blob;
}

export function getRequestBody(body: any): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (isString(body)) {
    return body;
  }

  if (isBlob(body)) {
    return body;
  }

  return JSON.stringify(body);
}

export function getResponseBody(response: Response) {
  const contentType = response.headers.get('Content-Type') ?? '';
  const isJSON = contentType.toLowerCase().startsWith('application/json');

  if (isJSON) {
    return response.json();
  }

  return response.text();
}
