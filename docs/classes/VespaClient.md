[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / VespaClient

# Class: VespaClient

Defined in: src/client.ts:32

The main client class for interacting with a Vespa application.

## Constructors

### Constructor

> **new VespaClient**(`config`): `VespaClient`

Defined in: src/client.ts:41

Creates an instance of VespaClient.

#### Parameters

##### config

[`VespaClientConfig`](../interfaces/VespaClientConfig.md)

Configuration for the client.

#### Returns

`VespaClient`

## Properties

### applicationPackage?

> `readonly` `optional` **applicationPackage**: [`ApplicationPackage`](ApplicationPackage.md)

Defined in: src/client.ts:35

## Methods

### delete()

> **delete**(`params`): `Promise`\<[`VespaResponse`](../interfaces/VespaResponse.md)\>

Defined in: src/client.ts:94

Deletes a single document from the Vespa application.

#### Parameters

##### params

[`DocumentOperationParams`](../interfaces/DocumentOperationParams.md)

Parameters for the delete operation.

#### Returns

`Promise`\<[`VespaResponse`](../interfaces/VespaResponse.md)\>

A promise resolving to the delete response.

***

### deploy()

> **deploy**(`appPackage`, `options`): `Promise`\<[`VespaDeployResponse`](../interfaces/VespaDeployResponse.md)\>

Defined in: src/client.ts:142

Deploys an application package to Vespa Cloud.
Requires appropriate authentication (Token or mTLS) to be configured.
Requires tenant and application name.

#### Parameters

##### appPackage

[`ApplicationPackage`](ApplicationPackage.md)

The ApplicationPackage to deploy.

##### options

[`DeployOptions`](../interfaces/DeployOptions.md)

Deployment options including the application name and tenant details.

#### Returns

`Promise`\<[`VespaDeployResponse`](../interfaces/VespaDeployResponse.md)\>

A promise resolving to the deployment response.

#### Throws

VespaConfigurationError if required deployment info is missing.

***

### feed()

> **feed**(`params`): `Promise`\<[`VespaResponse`](../interfaces/VespaResponse.md)\>

Defined in: src/client.ts:72

Feeds a single document to the Vespa application.

#### Parameters

##### params

[`FeedDocumentParams`](../interfaces/FeedDocumentParams.md)

Parameters for the feed operation.

#### Returns

`Promise`\<[`VespaResponse`](../interfaces/VespaResponse.md)\>

A promise resolving to the feed response.

***

### feedIterable()

> **feedIterable**(`iter`, `options`): `Promise`\<`void`\>

Defined in: src/client.ts:106

Feeds documents from an async iterable source concurrently.

#### Parameters

##### iter

`AsyncIterable`\<[`DocumentOperationParams`](../interfaces/DocumentOperationParams.md) \| [`FeedDocumentParams`](../interfaces/FeedDocumentParams.md) \| [`UpdateDocumentParams`](../interfaces/UpdateDocumentParams.md)\>

An async iterable yielding document parameters.

##### options

[`FeedIterableOptions`](../interfaces/FeedIterableOptions.md)

Options controlling the feeding process (concurrency, callbacks, etc.).

#### Returns

`Promise`\<`void`\>

A promise that resolves when all documents have been processed.

***

### getApplicationStatus()

> **getApplicationStatus**(): `Promise`\<[`VespaStatusResponse`](../interfaces/VespaStatusResponse.md)\>

Defined in: src/client.ts:118

Checks the status of the Vespa application endpoint.

#### Returns

`Promise`\<[`VespaStatusResponse`](../interfaces/VespaStatusResponse.md)\>

A promise resolving to the application status response.

***

### getModelEndpoint()

> **getModelEndpoint**(`modelId?`): `Promise`\<[`VespaModelEndpointResponse`](../interfaces/VespaModelEndpointResponse.md)\>

Defined in: src/client.ts:128

Retrieves stateless model evaluation endpoints.

#### Parameters

##### modelId?

`string`

Optional model ID to filter endpoints.

#### Returns

`Promise`\<[`VespaModelEndpointResponse`](../interfaces/VespaModelEndpointResponse.md)\>

A promise resolving to the model endpoint response.

***

### query()

> **query**(`params`): `Promise`\<[`VespaQueryResponse`](../interfaces/VespaQueryResponse.md)\>

Defined in: src/client.ts:62

Sends a query request to the Vespa application.

#### Parameters

##### params

[`QueryParams`](../interfaces/QueryParams.md)

Query parameters.

#### Returns

`Promise`\<[`VespaQueryResponse`](../interfaces/VespaQueryResponse.md)\>

A promise resolving to the query response.

***

### update()

> **update**(`params`): `Promise`\<[`VespaResponse`](../interfaces/VespaResponse.md)\>

Defined in: src/client.ts:83

Updates a single document in the Vespa application.

#### Parameters

##### params

[`UpdateDocumentParams`](../interfaces/UpdateDocumentParams.md)

Parameters for the update operation.

#### Returns

`Promise`\<[`VespaResponse`](../interfaces/VespaResponse.md)\>

A promise resolving to the update response.
