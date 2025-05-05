[**ts-vespa v1.0.0**](../README.md)

***

[ts-vespa](../README.md) / QueryParams

# Interface: QueryParams

Defined in: src/types/vespa.ts:158

Parameters for a Vespa query request.

## Indexable

\[`key`: `string`\]: `any`

Other arbitrary parameters to include in the query body.

## Properties

### body?

> `optional` **body**: `object`

Defined in: src/types/vespa.ts:164

The request body, often used for more complex queries or when YQL is not used directly.

#### Index Signature

\[`key`: `string`\]: `any`

***

### groupname?

> `optional` **groupname**: `string`

Defined in: src/types/vespa.ts:166

Optional groupname for streaming search.

***

### model?

> `optional` **model**: `object`

Defined in: src/types/vespa.ts:176

Optional model restriction.

#### Index Signature

\[`key`: `string`\]: `any`

***

### query?

> `optional` **query**: `object`

Defined in: src/types/vespa.ts:162

Query parameters sent as URL query string params.

#### Index Signature

\[`key`: `string`\]: `string` \| `number` \| `boolean`

***

### ranking?

> `optional` **ranking**: `string` \| \{[`key`: `string`]: `any`; `profile?`: `string`; \}

Defined in: src/types/vespa.ts:174

Optional ranking profile.

***

### route?

> `optional` **route**: `string`

Defined in: src/types/vespa.ts:170

Optional route specification.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: src/types/vespa.ts:168

Optional timeout for the specific request (in milliseconds).

***

### tracelevel?

> `optional` **tracelevel**: `number`

Defined in: src/types/vespa.ts:172

Optional trace level.

***

### yql?

> `optional` **yql**: `string`

Defined in: src/types/vespa.ts:160

The YQL (Vespa Query Language) string.
