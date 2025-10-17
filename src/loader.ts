import dotenv from 'dotenv';
import { EnvFromSchema, LoadOptions, Schema } from './types.js';
import { coerceAndValidate, EnvValidationError } from './validator.js';

function loadDotenv(options?: LoadOptions) {
    const path = options?.dotenvPath;
    const override = options?.override ?? false;
    dotenv.config({ path, override });
}

function collectErrors(schema: Schema): never {
    // This function is used only as a type trick; callsites build the errors and throw AggregateError
    throw new Error('collectErrors should not be called directly');
}

export function loadEnv<TSchema extends Schema>(schema: TSchema, options?: LoadOptions): EnvFromSchema<TSchema> {
    loadDotenv(options);

    const errors: Error[] = [];
    const result: Record<string, unknown> = {};

    for (const item of schema) {
        const raw = process.env[item.name];
        try {
            const coerced = coerceAndValidate(raw, item);
            if (coerced !== undefined) {
                result[item.name] = coerced;
            } else if (item.optional === true) {
                result[item.name] = undefined;
            } else {
                // coerceAndValidate would have thrown on missing required
            }
        } catch (err) {
            if (err instanceof EnvValidationError) {
                errors.push(err);
            } else if (err instanceof Error) {
                errors.push(err);
            } else {
                errors.push(new Error(String(err)));
            }
        }
    }

    if (errors.length > 0) {
        const message = [
            'Environment validation failed:',
            ...errors.map((e) => `- ${e.message}`),
        ].join('\n');
        throw new AggregateError(errors, message);
    }

    return result as EnvFromSchema<TSchema>;
}


