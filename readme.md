# validation-env

<img src="https://res.cloudinary.com/dbhcx7cfh/image/upload/v1760720853/logo.730Z_umnuze.png" alt="validation-env Logo" width="200"/>



A powerful and type-safe environment variable manager for Node.js applications with validation, type conversion, and comprehensive error handling.

## Requirements

- Node.js >= 20
- ESM enabled (this package is ESM)

## Installation

```bash
npm i validation-env
# ou
yarn add validation-env
```

## Concept

You define a schema of environment variables (name and type) and call `loadEnv(schema)`. The function loads `.env` (via `dotenv`), validates, coerces types, and returns a strongly-typed object based on the schema using TypeScript inference.

### Supported types

- `string`
- `number`
- `boolean` (only "true"/"false", case-insensitive)
- `email`
- `url`

Optional fields: set `optional: true`. For empty strings, use `allowEmpty: true`.

## Quick start

Optionally create an `env.schema.ts` file in your project:

```ts
// env.schema.ts
import { EnvSchema } from 'validation-env';

export const envSchema:EnvSchema = [
  { name: 'PORT', type: 'number' },
  { name: 'NODE_ENV', type: 'string' },
  { name: 'DATABASE_URL', type: 'url' },
  { name: 'API_KEY', type: 'string' },
  { name: 'DEBUG', type: 'boolean', optional: true },
] 
```

In your code:

```ts
import { loadEnv } from 'validation-env';
import { envSchema } from './env.schema';

const env = loadEnv(envSchema);

// Types inferred from schema
// env.PORT: number
// env.NODE_ENV: string
// env.DATABASE_URL: string
// env.API_KEY: string
// env.DEBUG?: boolean
```

Or define the schema inline:

```ts
import { loadEnv } from 'validation-env';

const env = loadEnv([
  { name: 'PORT', type: 'number' },
  { name: 'NODE_ENV', type: 'string' },
  { name: 'DATABASE_URL', type: 'url' },
  { name: 'API_KEY', type: 'string' },
  { name: 'DEBUG', type: 'boolean', optional: true },
] as const);
```

## Example .env

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=https://db.example.com
API_KEY=super-secret
DEBUG=false
```

## Validation rules

- `boolean`: only "true" or "false" (case-insensitive). Any other value throws.
- `number`: numeric values (integer or decimal). Infinite/NaN will throw.
- `email`: simple RFC5322-lite validation.
- `url`: validated using `new URL(value)`.
- `string`: by default empty strings are not allowed; use `allowEmpty: true` to allow.
- `optional: true`: variable can be absent; when present, it is still validated.

## Options

```ts
loadEnv(schema, {
  dotenvPath: '.env', // custom path
  override: false     // whether to override already-set process variables
});
```

## Errors and messages

If validation fails, an `AggregateError` is thrown containing all issues found:

```text
Environment validation failed:
- PORT must be a valid number (received: "abc")
- DEBUG must be "true" or "false" (received: "1")
- Missing required env var: API_KEY
```

Handle the error in your app bootstrap:

```ts
try {
  const env = loadEnv(envSchema);
  // start app…
} catch (e) {
  console.error(String(e));
  process.exit(1);
}
```
```ts
type SupportedKind = 'string' | 'number' | 'boolean' | 'email' | 'url'

```

## License

MIT © [Dhmeson Noronha Araujo](https://github.com/Dhmeson)
