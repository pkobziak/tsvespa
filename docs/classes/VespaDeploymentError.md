[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / VespaDeploymentError

# Class: VespaDeploymentError

Defined in: src/utils/errors.ts:57

Represents an error during the application deployment process.

## Extends

- [`TsVespaError`](TsVespaError.md)

## Constructors

### Constructor

> **new VespaDeploymentError**(`message`): `VespaDeploymentError`

Defined in: src/utils/errors.ts:58

#### Parameters

##### message

`string`

#### Returns

`VespaDeploymentError`

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

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`TsVespaError`](TsVespaError.md).[`stack`](TsVespaError.md#stack)

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
