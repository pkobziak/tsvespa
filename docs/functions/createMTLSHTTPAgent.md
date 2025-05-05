[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / createMTLSHTTPAgent

# Function: createMTLSHTTPAgent()

> **createMTLSHTTPAgent**(`config`): `Agent`

Defined in: src/transport/auth.ts:47

Creates an HTTPS agent configured for mTLS authentication.

## Parameters

### config

[`MTLSAuth`](../interfaces/MTLSAuth.md)

The mTLS authentication configuration.

## Returns

`Agent`

An https.Agent configured for mTLS.

## Throws

VespaAuthenticationError if certificate or key files cannot be read.
