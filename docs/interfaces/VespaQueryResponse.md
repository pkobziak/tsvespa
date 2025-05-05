[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / VespaQueryResponse

# Interface: VespaQueryResponse

Defined in: src/types/vespa.ts:25

Represents a response specifically from a Vespa query operation.
Extends VespaResponse and includes query-specific fields like hits.

## Extends

- [`VespaResponse`](VespaResponse.md)

## Properties

### hits?

> `optional` **hits**: [`VespaHit`](VespaHit.md)[]

Defined in: src/types/vespa.ts:39

Array of search results (hits).

***

### json?

> `optional` **json**: `any`

Defined in: src/types/vespa.ts:12

The parsed JSON body of the response, if available.

#### Inherited from

[`VespaResponse`](VespaResponse.md).[`json`](VespaResponse.md#json)

***

### operationType

> **operationType**: `string`

Defined in: src/types/vespa.ts:18

The type of operation performed (e.g., 'feed', 'query', 'update', 'delete').

#### Inherited from

[`VespaResponse`](VespaResponse.md).[`operationType`](VespaResponse.md#operationtype)

***

### root?

> `optional` **root**: `object`

Defined in: src/types/vespa.ts:27

The root object of the query response, containing timing, hits, etc.

#### children?

> `optional` **children**: [`VespaHit`](VespaHit.md)[]

#### coverage?

> `optional` **coverage**: `any`

#### fields?

> `optional` **fields**: `object`

##### Index Signature

\[`key`: `string`\]: `any`

##### fields.totalCount?

> `optional` **totalCount**: `number`

#### id

> **id**: `string`

#### relevance

> **relevance**: `number`

#### timing?

> `optional` **timing**: `any`

***

### statusCode

> **statusCode**: `number`

Defined in: src/types/vespa.ts:8

HTTP status code returned by Vespa.

#### Inherited from

[`VespaResponse`](VespaResponse.md).[`statusCode`](VespaResponse.md#statuscode)

***

### text?

> `optional` **text**: `string`

Defined in: src/types/vespa.ts:14

The raw text body of the response, if JSON parsing failed or wasn't applicable.

#### Inherited from

[`VespaResponse`](VespaResponse.md).[`text`](VespaResponse.md#text)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: src/types/vespa.ts:41

Total number of documents matching the query.

***

### url

> **url**: `string`

Defined in: src/types/vespa.ts:10

The URL that was requested.

#### Inherited from

[`VespaResponse`](VespaResponse.md).[`url`](VespaResponse.md#url)

## Methods

### isSuccess()

> **isSuccess**(): `boolean`

Defined in: src/types/vespa.ts:16

Indicates if the request was successful (typically status code 2xx).

#### Returns

`boolean`

#### Inherited from

[`VespaResponse`](VespaResponse.md).[`isSuccess`](VespaResponse.md#issuccess)
