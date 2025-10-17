import { SchemaItem, SupportedKind } from './types.js';

export class EnvValidationError extends Error {
    public readonly variableName: string;
    public readonly expectedType: SupportedKind;
    public readonly received: string | undefined;

    constructor(variableName: string, expectedType: SupportedKind, received: string | undefined, message?: string) {
        super(message ?? `Invalid value for ${variableName}`);
        this.variableName = variableName;
        this.expectedType = expectedType;
        this.received = received;
        this.name = 'EnvValidationError';
    }
}

const trimTo = (value: string, max = 100): string => (value.length > max ? value.slice(0, max) + '…' : value);

export type Coerced = string | number | boolean;

export function coerceAndValidate(value: string | undefined, item: SchemaItem): Coerced | undefined {
    const type = item.type;
    const name = item.name;

    if (value == null || value === undefined) {
        if (item.optional === true) return undefined;
        throw new EnvValidationError(name, type, value, `Missing required env var: ${name}`);
    }

    switch (type) {
        case 'string':
            if (value === '' && item.allowEmpty !== true) {
                throw new EnvValidationError(name, 'string', value, `${name} must be a non-empty string`);
            }
            return value;
        case 'boolean': {
            const v = value.toLowerCase();
            if (v === 'true') return true;
            if (v === 'false') return false;
            throw new EnvValidationError(name, 'boolean', value, `${name} must be "true" or "false" (received: "${trimTo(value)}")`);
        }
        case 'number': {
            const num = Number(value);
            if (!Number.isFinite(num)) {
                throw new EnvValidationError(name, 'number', value, `${name} must be a valid number (received: "${trimTo(value)}")`);
            }
            return num;
        }
        case 'email': {
            // Simple RFC5322-lite pattern
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                throw new EnvValidationError(name, 'email', value, `${name} must be a valid email (received: "${trimTo(value)}")`);
            }
            return value;
        }
        case 'url': {
            try {
                // eslint-disable-next-line no-new
                new URL(value);
                return value;
            } catch {
                throw new EnvValidationError(name, 'url', value, `${name} must be a valid URL (received: "${trimTo(value)}")`);
            }
        }
        default: {
            const neverType: never = type;
            throw new EnvValidationError(name, neverType as unknown as SupportedKind, value, `Unsupported type: ${String(type)}`);
        }
    }
}


