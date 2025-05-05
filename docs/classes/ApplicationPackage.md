[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / ApplicationPackage

# Class: ApplicationPackage

Defined in: src/config/application.ts:20

Represents a Vespa application package, containing configuration files like
schemas, services.xml, hosts.xml, etc.

## Constructors

### Constructor

> **new ApplicationPackage**(`name`): `ApplicationPackage`

Defined in: src/config/application.ts:29

Creates an ApplicationPackage instance.

#### Parameters

##### name

`string`

The name of the application package.

#### Returns

`ApplicationPackage`

## Properties

### name

> `readonly` **name**: `string`

Defined in: src/config/application.ts:21

## Accessors

### schemas

#### Get Signature

> **get** **schemas**(): `Map`\<`string`, [`Schema`](Schema.md)\>

Defined in: src/config/application.ts:112

Gets a map of all schemas currently in the package.
Assumes schemas are stored under a "schemas/" directory with ".sd" extension.

##### Returns

`Map`\<`string`, [`Schema`](Schema.md)\>

A map where keys are schema names and values are Schema objects.

## Methods

### addDirectory()

> **addDirectory**(`sourceDir`, `destinationDir`): `void`

Defined in: src/config/application.ts:72

Adds a directory and its contents recursively to the application package.
Files will be placed relative to the specified destination directory within the package.

#### Parameters

##### sourceDir

`string`

The absolute path to the local directory to add.

##### destinationDir

`string` = `"."`

The relative path within the application package where the directory contents should be placed (e.g., "components", "search/query-profiles"). Defaults to the root.

#### Returns

`void`

***

### addFile()

> **addFile**(`relativePath`, `content`): `void`

Defined in: src/config/application.ts:57

Adds or replaces a file within the application package structure.

#### Parameters

##### relativePath

`string`

The path relative to the application package root (e.g., "services.xml", "schemas/my_schema.sd", "components/my_component.jar").

##### content

The content of the file (string or Buffer).

`string` | `Buffer`\<`ArrayBufferLike`\>

#### Returns

`void`

***

### addSchema()

> **addSchema**(`schema`): `void`

Defined in: src/config/application.ts:47

Adds a schema to the application package.

#### Parameters

##### schema

[`Schema`](Schema.md)

The Schema object to add.

#### Returns

`void`

***

### getFileContent()

> **getFileContent**(`relativePath`): `undefined` \| `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: src/config/application.ts:101

Retrieves the content of a specific file within the package.

#### Parameters

##### relativePath

`string`

The relative path of the file.

#### Returns

`undefined` \| `string` \| `Buffer`\<`ArrayBufferLike`\>

The file content (string or Buffer), or undefined if not found.

***

### toZipBuffer()

> **toZipBuffer**(): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: src/config/application.ts:139

Generates the application package as a zipped Buffer, ready for deployment.

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

A promise resolving to a Buffer containing the zipped application package.

***

### toZipFile()

> **toZipFile**(`targetPath?`): `Promise`\<`string`\>

Defined in: src/config/application.ts:166

Generates the application package as a zip file saved to the filesystem.

#### Parameters

##### targetPath?

`string`

Optional path to save the zip file. Defaults to a temporary file.

#### Returns

`Promise`\<`string`\>

A promise resolving to the path where the zip file was saved.
