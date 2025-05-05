[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / VespaClientConfig

# Interface: VespaClientConfig

Defined in: src/client.ts:18

Configuration for the VespaClient.

## Properties

### applicationPackage?

> `optional` **applicationPackage**: [`ApplicationPackage`](../classes/ApplicationPackage.md)

Defined in: src/client.ts:24

An optional ApplicationPackage instance associated with this client.

***

### auth?

> `optional` **auth**: [`AuthConfig`](../type-aliases/AuthConfig.md)

Defined in: src/client.ts:22

Authentication configuration. Defaults to no authentication.

***

### endpoint

> **endpoint**: `string`

Defined in: src/client.ts:20

The base URL of the Vespa endpoint (e.g., http://localhost:8080 or https://<instance>.<tenant>.<region>.vespa-app.cloud).

***

### httpConfig?

> `optional` **httpConfig**: `Partial`\<`Omit`\<`VespaHttpConfig`, `"baseUrl"` \| `"authConfig"`\>\>

Defined in: src/client.ts:26

Optional HTTP client configuration overrides.
