[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / FeedIterableOptions

# Interface: FeedIterableOptions

Defined in: src/types/vespa.ts:184

Options for the feedIterable operation.

## Properties

### callback()?

> `optional` **callback**: (`response`, `id`) => `void`

Defined in: src/types/vespa.ts:194

Callback function executed for each operation's result.

#### Parameters

##### response

`Error` | [`VespaResponse`](VespaResponse.md)

##### id

`string`

#### Returns

`void`

***

### condition?

> `optional` **condition**: `string`

Defined in: src/types/vespa.ts:202

Optional condition for conditional mutations.

***

### create?

> `optional` **create**: `boolean`

Defined in: src/types/vespa.ts:204

Optional create flag for conditional mutations (feed/update).

***

### maxWorkers?

> `optional` **maxWorkers**: `number`

Defined in: src/types/vespa.ts:192

Maximum number of concurrent feed operations. Defaults to a reasonable number (e.g., 50).

***

### namespace?

> `optional` **namespace**: `string`

Defined in: src/types/vespa.ts:188

The Vespa document id namespace. If not provided, the schema name is used.

***

### operationType?

> `optional` **operationType**: `"feed"` \| `"update"` \| `"delete"`

Defined in: src/types/vespa.ts:190

The type of operation ('feed', 'update', 'delete'). Defaults to 'feed'.

***

### route?

> `optional` **route**: `string`

Defined in: src/types/vespa.ts:198

Optional route specification.

***

### schema?

> `optional` **schema**: `string`

Defined in: src/types/vespa.ts:186

The Vespa schema name. If not provided, it might be inferred if an ApplicationPackage is associated with the client.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: src/types/vespa.ts:196

Optional timeout for individual operations within the iterable (in milliseconds).

***

### tracelevel?

> `optional` **tracelevel**: `number`

Defined in: src/types/vespa.ts:200

Optional trace level.
