# Validation-Env

<img src="https://i.imgur.com/BkxShIO.jpeg" alt="validation-env Logo" width="200"/>

[![npm version](https://badge.fury.io/js/validation-env.svg)](https://badge.fury.io/js/validation-env)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful and type-safe environment variable manager for Node.js applications with validation, type conversion, and comprehensive error handling.

## Requisitos

- Node.js >= 20
- ESM habilitado (este pacote é ESM)

## Instalação

```bash
npm i validation-env
# ou
yarn add validation-env
```

## Conceito

Você define um "schema" das variáveis de ambiente (nome e tipo) e chama `loadEnv(schema)`. A função carrega o `.env` (via `dotenv`), valida, converte os tipos e retorna um objeto tipado de acordo com o schema em tempo de compilação (TypeScript).

### Tipos suportados

- `string`
- `number`
- `boolean` (somente "true"/"false", case-insensitive)
- `email`
- `url`

Campos opcionais: defina `optional: true`. Para strings vazias, use `allowEmpty: true`.

## Uso rápido

Crie (opcional) um arquivo `env.schema.ts` no seu projeto:

```ts
// env.schema.ts
export const envSchema = [
  { name: 'PORT', type: 'number' },
  { name: 'NODE_ENV', type: 'string' },
  { name: 'DATABASE_URL', type: 'url' },
  { name: 'API_KEY', type: 'string' },
  { name: 'DEBUG', type: 'boolean', optional: true },
] as const;
```

No seu código:

```ts
import { loadEnv } from 'validation-env';
import { envSchema } from './env.schema';

const env = loadEnv(envSchema);

// Tipagem inferida a partir do schema
// env.PORT: number
// env.NODE_ENV: string
// env.DATABASE_URL: string
// env.API_KEY: string
// env.DEBUG?: boolean
```

Ou defina o schema inline:

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

## .env de exemplo

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=https://db.example.com
API_KEY=super-secret
DEBUG=false
```

## Regras de validação

- `boolean`: somente "true" ou "false" (case-insensitive). Outros valores geram erro.
- `number`: valores numéricos (inteiro ou decimal). Infinito/NaN geram erro.
- `email`: verificação simples (RFC5322-lite).
- `url`: validada com `new URL(value)`.
- `string`: por padrão não aceita vazio; para permitir vazio, use `allowEmpty: true`.
- `optional: true`: a variável pode faltar; quando presente, ainda é validada.

## Opções

```ts
loadEnv(schema, {
  dotenvPath: '.env', // caminho customizado
  override: false     // se deve sobrescrever variáveis já setadas no processo
});
```

## Erros e mensagens

Em caso de falhas, um `AggregateError` é lançado contendo todas as inconsistências encontradas:

```text
Environment validation failed:
- PORT must be a valid number (received: "abc")
- DEBUG must be "true" or "false" (received: "1")
- Missing required env var: API_KEY
```

Trate o erro no bootstrap da sua aplicação:

```ts
try {
  const env = loadEnv(envSchema);
  // start app...
} catch (e) {
  console.error(String(e));
  process.exit(1);
}
```

## Dicas de uso

- Marque o array do schema com `as const` para melhor inferência de tipos.
- Em apps ESM/TypeScript com `module: NodeNext`, use extensões `.js` nos imports compilados. Consumindo via npm, importe somente `validation-env`.

## API (TypeScript)

```ts
type SupportedKind = 'string' | 'number' | 'boolean' | 'email' | 'url'

interface SchemaItem {
  name: string
  type: SupportedKind
  optional?: boolean
  allowEmpty?: boolean // apenas para string
}

type Schema = readonly SchemaItem[]

declare function loadEnv<T extends Schema>(
  schema: T,
  options?: { dotenvPath?: string; override?: boolean }
): {
  [K in T[number] as K['name']]: K['optional'] extends true
    ? (K['type'] extends 'number' ? number : K['type'] extends 'boolean' ? boolean : string) | undefined
    : K['type'] extends 'number' ? number : K['type'] extends 'boolean' ? boolean : string
}
```

## License

MIT © [Dhmeson Noronha Araujo](https://github.com/Dhmeson)
