import { getResponseBody } from './helpers';

export type FetcherErrorOptions = {
  status: number;
  message: string;
  body: any;
  url: string;
};

export class FetcherError extends Error {
  status: any;
  body: any;
  url: string;

  constructor(args: FetcherErrorOptions) {
    super(args.message);
    this.name = this.constructor.name;
    this.status = args.status;
    this.body = args.body;
    this.url = args.url;
  }
}

export async function errorFromResponse(response: Response) {
  const body = await getResponseBody(response);
  return new FetcherError({
    body,
    message: response.statusText,
    status: response.status,
    url: response.url,
  });
}
