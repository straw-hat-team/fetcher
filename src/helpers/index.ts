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

const JSON_CONTENT_TYPE_REGEX = /^application\/(.+\+)?json$/g

export function getResponseBody(response: Response) {
  const contentType = response.headers.get('Content-Type') ?? '';
  const isJSON = contentType.toLowerCase().match(JSON_CONTENT_TYPE_REGEX);

  if (isJSON) {
    return response.json();
  }

  return response.text();
}
