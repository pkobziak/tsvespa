[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / VespaHttpError

# Class: VespaHttpError

Defined in: src/utils/errors.ts:20

Represents an error originating from the Vespa HTTP API.

## Extends

- [`TsVespaError`](TsVespaError.md)

## Extended by

- [`VespaServerError`](VespaServerError.md)

## Constructors

### Constructor

> **new VespaHttpError**(`message`, `statusCode`, `url`, `responseBody?`): `VespaHttpError`

Defined in: src/utils/errors.ts:25

#### Parameters

##### message

`string`

##### statusCode

`number`

##### url

`string`

##### responseBody?

`any`

#### Returns

`VespaHttpError`

#### Overrides

[`TsVespaError`](TsVespaError.md).[`constructor`](TsVespaError.md#constructor)

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`TsVespaError`](TsVespaError.md).[`message`](TsVespaError.md#message)

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`TsVespaError`](TsVespaError.md).[`name`](TsVespaError.md#name)

***

### responseBody?

> `readonly` `optional` **responseBody**: `any`

Defined in: src/utils/errors.ts:23

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`TsVespaError`](TsVespaError.md).[`stack`](TsVespaError.md#stack)

***

### statusCode

> `readonly` **statusCode**: `number`

Defined in: src/utils/errors.ts:21

***

### url

> `readonly` **url**: `string`

Defined in: src/utils/errors.ts:22

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

[`TsVespaError`](TsVespaError.md).[`prepareStackTrace`](TsVespaError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`TsVespaError`](TsVespaError.md).[`stackTraceLimit`](TsVespaError.md#stacktracelimit)

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

[`TsVespaError`](TsVespaError.md).[`captureStackTrace`](TsVespaError.md#capturestacktrace)
