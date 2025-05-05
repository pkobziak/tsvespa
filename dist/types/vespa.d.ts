/**
 * Represents the basic structure of a response from Vespa, indicating success or failure.
 */
export interface VespaResponse {
    /** HTTP status code returned by Vespa. */
    statusCode: number;
    /** The URL that was requested. */
    url: string;
    /** The parsed JSON body of the response, if available. */
    json?: any;
    /** The raw text body of the response, if JSON parsing failed or wasn't applicable. */
    text?: string;
    /** Indicates if the request was successful (typically status code 2xx). */
    isSuccess(): boolean;
    /** The type of operation performed (e.g., 'feed', 'query', 'update', 'delete'). */
    operationType: string;
}
/**
 * Represents a response specifically from a Vespa query operation.
 * Extends VespaResponse and includes query-specific fields like hits.
 */
export interface VespaQueryResponse extends VespaResponse {
    /** The root object of the query response, containing timing, hits, etc. */
    root?: {
        id: string;
        relevance: number;
        coverage?: any;
        timing?: any;
        children?: VespaHit[];
        fields?: {
            totalCount?: number;
            [key: string]: any;
        };
    };
    /** Array of search results (hits). */
    hits?: VespaHit[];
    /** Total number of documents matching the query. */
    totalCount?: number;
}
/**
 * Represents a single search result (hit) from a Vespa query.
 */
export interface VespaHit {
    id: string;
    relevance: number;
    source?: string;
    fields?: {
        [key: string]: any;
    };
    children?: VespaHit[];
    [key: string]: any;
}
/**
 * Represents a response from a Vespa document get operation.
 */
export interface VespaGetResponse extends VespaResponse {
    pathId?: string;
    id?: string;
    fields?: {
        [key: string]: any;
    };
}
/**
 * Represents a response from a Vespa document visit operation.
 */
export interface VespaVisitResponse extends VespaResponse {
    pathId?: string;
    id?: string;
    continuation?: string;
    documentCount?: number;
    documents?: {
        id: string;
        fields: {
            [key: string]: any;
        };
    }[];
}
/**
 * Represents a response indicating the status of the Vespa application.
 */
export interface VespaStatusResponse extends VespaResponse {
    status?: {
        code: string;
        message: string;
    };
}
/**
 * Represents a response related to deployment operations.
 */
export interface VespaDeployResponse extends VespaResponse {
    sessionId?: string;
    logUrl?: string;
    message?: string;
}
/**
 * Represents a response containing model evaluation endpoint details.
 */
export interface VespaModelEndpointResponse extends VespaResponse {
    endpoints?: {
        modelId: string;
        url: string;
    }[];
}
/**
 * Base parameters for document operations (feed, update, delete).
 */
export interface DocumentOperationParams {
    /** The schema the document belongs to. */
    schema: string;
    /** The unique ID of the document within its namespace. */
    dataId: string;
    /** The namespace the document belongs to. Defaults to schema name if not provided. */
    namespace?: string;
    /** Optional groupname for streaming search. */
    groupname?: string;
    /** Optional timeout for the specific request (in milliseconds). */
    timeout?: number;
    /** Optional route specification. */
    route?: string;
    /** Optional trace level. */
    tracelevel?: number;
    /** Optional condition for conditional mutations. */
    condition?: string;
    /** Optional create flag for conditional mutations. */
    create?: boolean;
}
/**
 * Parameters for feeding a new document or replacing an existing one.
 */
export interface FeedDocumentParams extends DocumentOperationParams {
    /** Key-value pairs representing the document fields. */
    fields: {
        [key: string]: any;
    };
}
/**
 * Parameters for updating an existing document.
 */
export interface UpdateDocumentParams extends DocumentOperationParams {
    /** Key-value pairs representing the fields to update. Can include Vespa update operations. */
    fields: {
        [key: string]: any;
    };
    /** If true, creates the document if it doesn't exist. Defaults to false. */
    createIfNotExists?: boolean;
}
/**
 * Parameters for deleting a document.
 */
export type DeleteDocumentParams = DocumentOperationParams;
/**
 * Parameters for a Vespa query request.
 */
export interface QueryParams {
    /** The YQL (Vespa Query Language) string. */
    yql?: string;
    /** Query parameters sent as URL query string params. */
    query?: {
        [key: string]: string | number | boolean;
    };
    /** The request body, often used for more complex queries or when YQL is not used directly. */
    body?: {
        [key: string]: any;
    };
    /** Optional groupname for streaming search. */
    groupname?: string;
    /** Optional timeout for the specific request (in milliseconds). */
    timeout?: number;
    /** Optional route specification. */
    route?: string;
    /** Optional trace level. */
    tracelevel?: number;
    /** Optional ranking profile. */
    ranking?: string | {
        profile?: string;
        [key: string]: any;
    };
    /** Optional model restriction. */
    model?: {
        [key: string]: any;
    };
    /** Other arbitrary parameters to include in the query body. */
    [key: string]: any;
}
/**
 * Options for the feedIterable operation.
 */
export interface FeedIterableOptions {
    /** The Vespa schema name. If not provided, it might be inferred if an ApplicationPackage is associated with the client. */
    schema?: string;
    /** The Vespa document id namespace. If not provided, the schema name is used. */
    namespace?: string;
    /** The type of operation ('feed', 'update', 'delete'). Defaults to 'feed'. */
    operationType?: 'feed' | 'update' | 'delete';
    /** Maximum number of concurrent feed operations. Defaults to a reasonable number (e.g., 50). */
    maxWorkers?: number;
    /** Callback function executed for each operation's result. */
    callback?: (response: VespaResponse | Error, id: string) => void;
    /** Optional timeout for individual operations within the iterable (in milliseconds). */
    timeout?: number;
    /** Optional route specification. */
    route?: string;
    /** Optional trace level. */
    tracelevel?: number;
    /** Optional condition for conditional mutations. */
    condition?: string;
    /** Optional create flag for conditional mutations (feed/update). */
    create?: boolean;
}
/**
 * Options for deploying an application package to Vespa Cloud.
 */
export interface DeployOptions {
    /** Vespa Cloud application name. */
    applicationName: string;
    instance?: string;
    diskLimit?: number;
    memoryLimit?: number;
    vcpuLimit?: number;
}
