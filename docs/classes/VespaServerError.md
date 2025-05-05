[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / VespaServerError

# Class: VespaServerError

Defined in: src/utils/errors.ts:36

Represents an error specifically parsed from Vespa's JSON error response format.

## Extends

- [`VespaHttpError`](VespaHttpError.md)

## Constructors

### Constructor

> **new VespaServerError**(`message`, `statusCode`, `url`, `responseBody?`, `vespaErrors?`): `VespaServerError`

Defined in: src/utils/errors.ts:39

#### Parameters

##### message

`string`

##### statusCode

`number`

##### url

`string`

##### responseBody?

`any`

##### vespaErrors?

`any`[]

#### Returns

`VespaServerError`

#### Overrides

[`VespaHttpError`](VespaHttpError.md).[`constructor`](VespaHttpError.md#constructor)

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`VespaHttpError`](VespaHttpError.md).[`message`](VespaHttpError.md#message)

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`VespaHttpError`](VespaHttpError.md).[`name`](VespaHttpError.md#name)

***

### responseBody?

> `readonly` `optional` **responseBody**: `any`

Defined in: src/utils/errors.ts:23

#### Inherited from

[`VespaHttpError`](VespaHttpError.md).[`responseBody`](VespaHttpError.md#responsebody)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`VespaHttpError`](VespaHttpError.md).[`stack`](VespaHttpError.md#stack)

***

### statusCode

> `readonly` **statusCode**: `number`

Defined in: src/utils/errors.ts:21

#### Inherited from

[`VespaHttpError`](VespaHttpError.md).[`statusCode`](VespaHttpError.md#statuscode)

***

### url

> `readonly` **url**: `string`

Defined in: src/utils/errors.ts:22

#### Inherited from

[`VespaHttpError`](VespaHttpError.md).[`url`](VespaHttpError.md#url)

***

### vespaErrors?

> `readonly` `optional` **vespaErrors**: `any`[]

Defined in: src/utils/errors.ts:37

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

[`VespaHttpError`](VespaHttpError.md).[`prepareStackTrace`](VespaHttpError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`VespaHttpError`](VespaHttpError.md).[`stackTraceLimit`](VespaHttpError.md#stacktracelimit)

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

[`VespaHttpError`](VespaHttpError.md).[`captureStackTrace`](VespaHttpError.md#capturestacktrace)
