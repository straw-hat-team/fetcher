# @straw-hat/fetcher

HTTP client, based on middleware pipeline.

## Installation

```shell
yarn add @straw-hat/fetcher
```

## Usage

### Creating the client

First we need to create an instance of the client.

This instance will have the middleware based on your needs (More about
middleware later, keep reading).

For this example we will using `baseUrl` middleware.

> **Note**
>
> Check `middlewares` folder for the list of supported middleware. Suggestions
> for new middleware are open.

```javascript
// myHttpClient.js
import { baseUrl } from '@straw-hat/fetcher/dist/middlewares/base-url';
import { defaultHeaders } from '@straw-hat/fetcher/dist/middlewares/default-headers';
import { composeMiddleware } from '@straw-hat/fetcher/dist/middlewares/middleware';
import { fetcher } from '@straw-hat/fetcher';

const client = fetcher({
  middleware: composeMiddleware(
    // Add default headers
    defaultHeaders({
      'User-Agent': 'MyApp/1.0',
    }),
    // Concatenate the base url with the current URL.
    baseUrl('http://api.myapp.com/v1')
  ),
});

export default client;
```

Notice that `composeMiddleware` takes a list of middleware as parameters and
returns composed middleware for the client.

Now you can start using `client` 🎸🎉🎊.

### Using the client

```javascript
// This is where we exported our client from the previous example.
import client from './myHttpClient';

(async () => {
  const json = await client('/example.com').json();

  console.log(json);
  //=> `{data: 'Hola, Mundo 🌍'}`
})();
```

## Middleware

A middleware is something that could transform the request and/or response.

A middleware is a function that takes a the next dispatcher from the next
middleware as parameter and returns a promise of the implement of the current
middleware.

For understanding middleware, it is probably better to take a look at the type
specifications.

```typescript
// RequestInit comes from lib.dom.d.ts file
export interface HttpRequest extends RequestInit {
  context: Record<any, any>;
  headers: Headers;
  url: string;
}

export type Dispatch<T> = (request: HttpRequest) => Promise<T>;

export type Middleware<T, P = Response> = (next: Dispatch<P>) => Dispatch<T>;
```

For example, a middleware that log the requests.

```javascript
const logger = (next) => async (request) => {
  console.groupCollapsed('fetcher::logger');

  console.log('request', request);
  const response = await next(request);
  console.log('response', response);

  console.groupEnd();

  return response;
};
```

### Before and After Middleware

Since a middleware takes a dispatch of the next middleware the concept of
before and after middleware pretty much depends of the order on how you call
the `next` dispatcher.

For example

```javascript
const jsonMiddleware = (next) => async (request) => {
  // Do things before calling the next
  // AKA, Before middleware

  const response = await next(request);

  // Do things after calling the next
  // AKA, After middleware

  return response;
};
```

## Polyfills

Since `fetcher` uses `fetch` API under the hood depending of your environment
you will need to polyfill your environment.

We do not want to make assumption of your environment and your needs so the
best we could do is to let you decide what you want to do and document about it.

Since NodeJS do not support `fetch` by default, you will need to polyfill your
environment and on browsers it will depend of your version.

We recommend to use [cross-fetch](https://github.com/lquixada/cross-fetch) for
polyfill.

So before importing the the package in your application make sure to initialize
the polyfill or provide own `fetch` implementation.

For example:

```javascript
// myHttpClient.js

// global fix
import 'cross-fetch/polyfill';
import { fetcher } from '@straw-hat/fetcher';

// or local fix

import nodeFetch from 'node-fetch';
const client = fetcher({ fetch: nodeFetch });
```
