[**tsvespa v1.0.0**](../README.md)

***

[tsvespa](../README.md) / TsVespaError

# Class: TsVespaError

Defined in: src/utils/errors.ts:6

Base class for all custom errors related to the tsvespa library.

## Extends

- `Error`

## Extended by

- [`VespaHttpError`](VespaHttpError.md)
- [`VespaAuthenticationError`](VespaAuthenticationError.md)
- [`VespaDeploymentError`](VespaDeploymentError.md)
- [`VespaConfigurationError`](VespaConfigurationError.md)

## Constructors

### Constructor

> **new TsVespaError**(`message`): `TsVespaError`

Defined in: src/utils/errors.ts:7

#### Parameters

##### message

`string`

#### Returns

`TsVespaError`

#### Overrides

`Error.constructor`

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
