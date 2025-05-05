[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / VespaModelEndpointResponse

# Interface: VespaModelEndpointResponse

Defined in: src/types/vespa.ts:101

Represents a response containing model evaluation endpoint details.

## Extends

- [`VespaResponse`](VespaResponse.md)

## Properties

### endpoints?

> `optional` **endpoints**: `object`[]

Defined in: src/types/vespa.ts:103

#### modelId

> **modelId**: `string`

#### url

> **url**: `string`

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
