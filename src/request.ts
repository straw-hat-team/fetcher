export type Context = Record<any, any>;

export interface HttpRequest extends RequestInit {
  /**
   * A metadata object. Useful for pass some metadata cross middleware.
   */
  context: Context;
  headers: Headers;
  url: string;
}

/**
 * Transform a HttpRequest into an native Request
 * @param request
 */
export function asNativeRequest(request: HttpRequest) {
  const { url, context, ...requestInit } = request;
  return new Request(request.url, requestInit);
}

export function cloneRequest(request: HttpRequest): HttpRequest {
  return {
    ...request,
    context: {
      ...request.context,
    },
    headers: new Headers(request.headers),
  };
}
