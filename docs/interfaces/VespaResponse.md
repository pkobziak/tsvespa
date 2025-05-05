[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / VespaResponse

# Interface: VespaResponse

Defined in: src/types/vespa.ts:6

Represents the basic structure of a response from Vespa, indicating success or failure.

## Extended by

- [`VespaQueryResponse`](VespaQueryResponse.md)
- [`VespaGetResponse`](VespaGetResponse.md)
- [`VespaVisitResponse`](VespaVisitResponse.md)
- [`VespaStatusResponse`](VespaStatusResponse.md)
- [`VespaDeployResponse`](VespaDeployResponse.md)
- [`VespaModelEndpointResponse`](VespaModelEndpointResponse.md)

## Properties

### json?

> `optional` **json**: `any`

Defined in: src/types/vespa.ts:12

The parsed JSON body of the response, if available.

***

### operationType

> **operationType**: `string`

Defined in: src/types/vespa.ts:18

The type of operation performed (e.g., 'feed', 'query', 'update', 'delete').

***

### statusCode

> **statusCode**: `number`

Defined in: src/types/vespa.ts:8

HTTP status code returned by Vespa.

***

### text?

> `optional` **text**: `string`

Defined in: src/types/vespa.ts:14

The raw text body of the response, if JSON parsing failed or wasn't applicable.

***

### url

> **url**: `string`

Defined in: src/types/vespa.ts:10

The URL that was requested.

## Methods

### isSuccess()

> **isSuccess**(): `boolean`

Defined in: src/types/vespa.ts:16

Indicates if the request was successful (typically status code 2xx).

#### Returns

`boolean`
