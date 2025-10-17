export type SupportedKind = 'string' | 'number' | 'boolean' | 'email' | 'url';

export interface SchemaItemBase {
    name: string;
    type: SupportedKind;
    optional?: boolean; // default: false (required)
    allowEmpty?: boolean; // only for string types; ignored otherwise
}

export type SchemaItem = SchemaItemBase;

export type Schema = ReadonlyArray<SchemaItem>;

// Map a kind to its runtime value type
export type FromKind<K extends SupportedKind> =
    K extends 'string' ? string :
    K extends 'number' ? number :
    K extends 'boolean' ? boolean :
    K extends 'email' ? string :
    K extends 'url' ? string : never;

// Convert a schema definition to a typed env object
export type EnvFromSchema<TSchema extends Schema> = {
    [I in TSchema[number] as I['name']]: I['optional'] extends true
        ? FromKind<I['type']> | undefined
        : FromKind<I['type']>
};

export interface LoadOptions {
    dotenvPath?: string; // custom path to .env
    override?: boolean; // dotenv override
}


