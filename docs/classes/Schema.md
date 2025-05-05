[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / Schema

# Class: Schema

Defined in: src/config/schema.ts:8

Represents a Vespa schema definition.
For now, it primarily holds the schema content as a string.
Could be expanded to a structured object representation later.

## Constructors

### Constructor

> **new Schema**(`name`, `content`): `Schema`

Defined in: src/config/schema.ts:18

Creates a Schema instance.

#### Parameters

##### name

`string`

The name of the schema (e.g., "product").

##### content

`string`

The full content of the .sd file as a string.

#### Returns

`Schema`

## Properties

### content

> `readonly` **content**: `string`

Defined in: src/config/schema.ts:10

***

### name

> `readonly` **name**: `string`

Defined in: src/config/schema.ts:9
