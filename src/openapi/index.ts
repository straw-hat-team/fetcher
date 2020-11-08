export function replacePathParams(urlPath: string, pathParams: Record<string, any> = {}) {
  return Object.entries(pathParams).reduce(
    (theUrlPath, [name, value]) => theUrlPath.replaceAll(`{${name}}`, value),
    urlPath
  );
}

function addQueryParams(urlPath: string, queryParams: Record<any, any>) {
  const searchParams = new URLSearchParams(queryParams);
  return `${urlPath}?${searchParams.toString()}`;
}

export function createUrlPath(
  urlPath: string,
  params?: {
    path?: Record<any, any>;
    query?: Record<any, any>;
  }
) {
  const normalizedPath = replacePathParams(urlPath, params?.path);

  if (params?.query) {
    return addQueryParams(normalizedPath, params.query);
  }

  return normalizedPath;
}
