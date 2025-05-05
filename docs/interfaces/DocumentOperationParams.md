[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / DocumentOperationParams

# Interface: DocumentOperationParams

Defined in: src/types/vespa.ts:111

Base parameters for document operations (feed, update, delete).

## Extended by

- [`FeedDocumentParams`](FeedDocumentParams.md)
- [`UpdateDocumentParams`](UpdateDocumentParams.md)

## Properties

### condition?

> `optional` **condition**: `string`

Defined in: src/types/vespa.ts:127

Optional condition for conditional mutations.

***

### create?

> `optional` **create**: `boolean`

Defined in: src/types/vespa.ts:129

Optional create flag for conditional mutations.

***

### dataId

> **dataId**: `string`

Defined in: src/types/vespa.ts:115

The unique ID of the document within its namespace.

***

### groupname?

> `optional` **groupname**: `string`

Defined in: src/types/vespa.ts:119

Optional groupname for streaming search.

***

### namespace?

> `optional` **namespace**: `string`

Defined in: src/types/vespa.ts:117

The namespace the document belongs to. Defaults to schema name if not provided.

***

### route?

> `optional` **route**: `string`

Defined in: src/types/vespa.ts:123

Optional route specification.

***

### schema

> **schema**: `string`

Defined in: src/types/vespa.ts:113

The schema the document belongs to.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: src/types/vespa.ts:121

Optional timeout for the specific request (in milliseconds).

***

### tracelevel?

> `optional` **tracelevel**: `number`

Defined in: src/types/vespa.ts:125

Optional trace level.
