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

## What is next?

- [Middlewares](./docs/middlewares.md)
- [Polyfills](./docs/Polyfills.md)
- [OpenAPI](./docs/openapi.md)

