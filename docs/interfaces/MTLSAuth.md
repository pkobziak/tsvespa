[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / MTLSAuth

# Interface: MTLSAuth

Defined in: src/transport/auth.ts:21

Represents Mutual TLS (mTLS) authentication.

## Properties

### caCertPath?

> `optional` **caCertPath**: `string`

Defined in: src/transport/auth.ts:28

Optional path to the CA certificate file (.pem).

***

### certPath

> **certPath**: `string`

Defined in: src/transport/auth.ts:24

Path to the client certificate file (.pem).

***

### keyPath

> **keyPath**: `string`

Defined in: src/transport/auth.ts:26

Path to the client key file (.pem).

***

### type

> **type**: `"mtls"`

Defined in: src/transport/auth.ts:22
