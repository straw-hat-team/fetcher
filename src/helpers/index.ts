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
