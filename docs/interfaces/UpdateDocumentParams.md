[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / UpdateDocumentParams

# Interface: UpdateDocumentParams

Defined in: src/types/vespa.ts:143

Parameters for updating an existing document.

## Extends

- [`DocumentOperationParams`](DocumentOperationParams.md)

## Properties

### condition?

> `optional` **condition**: `string`

Defined in: src/types/vespa.ts:127

Optional condition for conditional mutations.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`condition`](DocumentOperationParams.md#condition)

***

### create?

> `optional` **create**: `boolean`

Defined in: src/types/vespa.ts:129

Optional create flag for conditional mutations.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`create`](DocumentOperationParams.md#create)

***

### createIfNotExists?

> `optional` **createIfNotExists**: `boolean`

Defined in: src/types/vespa.ts:147

If true, creates the document if it doesn't exist. Defaults to false.

***

### dataId

> **dataId**: `string`

Defined in: src/types/vespa.ts:115

The unique ID of the document within its namespace.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`dataId`](DocumentOperationParams.md#dataid)

***

### fields

> **fields**: `object`

Defined in: src/types/vespa.ts:145

Key-value pairs representing the fields to update. Can include Vespa update operations.

#### Index Signature

\[`key`: `string`\]: `any`

***

### groupname?

> `optional` **groupname**: `string`

Defined in: src/types/vespa.ts:119

Optional groupname for streaming search.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`groupname`](DocumentOperationParams.md#groupname)

***

### namespace?

> `optional` **namespace**: `string`

Defined in: src/types/vespa.ts:117

The namespace the document belongs to. Defaults to schema name if not provided.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`namespace`](DocumentOperationParams.md#namespace)

***

### route?

> `optional` **route**: `string`

Defined in: src/types/vespa.ts:123

Optional route specification.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`route`](DocumentOperationParams.md#route)

***

### schema

> **schema**: `string`

Defined in: src/types/vespa.ts:113

The schema the document belongs to.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`schema`](DocumentOperationParams.md#schema)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: src/types/vespa.ts:121

Optional timeout for the specific request (in milliseconds).

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`timeout`](DocumentOperationParams.md#timeout)

***

### tracelevel?

> `optional` **tracelevel**: `number`

Defined in: src/types/vespa.ts:125

Optional trace level.

#### Inherited from

[`DocumentOperationParams`](DocumentOperationParams.md).[`tracelevel`](DocumentOperationParams.md#tracelevel)
