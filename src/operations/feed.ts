// src/operations/feed.ts
import pLimit from "p-limit";
import { VespaHttpClient } from "../transport/http";
import {
    VespaResponse,
    FeedDocumentParams, UpdateDocumentParams, DeleteDocumentParams, FeedIterableOptions,
} from "../types/vespa";
import { VespaConfigurationError, TsVespaError } from "../utils/errors";

/**
 * Constructs the full Vespa document ID string.
 * Format: id:<namespace>:<schema>::<dataId>
 *
 * @param schema - The schema name.
 * @param dataId - The user-provided document ID part.
 * @param namespace - Optional namespace. Defaults to schema name.
 * @returns The fully qualified Vespa document ID.
 */
function buildDocumentId(schema: string, dataId: string, namespace?: string): string {
    const ns = namespace ?? schema;
    // Ensure parts don't contain problematic characters? Vespa handles most via URL encoding.
    return `id:${ns}:${schema}::${dataId}`;
}

/**
 * Performs a single feed operation (create or replace document).
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the feed operation.
 * @returns A promise resolving to the feed response.
 */
export async function feedOperation(httpClient: VespaHttpClient, params: FeedDocumentParams): Promise<VespaResponse> {
    if (!params.fields) {
        throw new VespaConfigurationError("Missing 'fields' for feed operation.");
    }
    const docId = buildDocumentId(params.schema, params.dataId, params.namespace);
    const path = `/document/v1/${encodeURIComponent(params.namespace ?? params.schema)}/${encodeURIComponent(params.schema)}/docid/${encodeURIComponent(params.dataId)}`;

    const queryParams: Record<string, any> = {};
    if (params.timeout) queryParams["timeout"] = `${params.timeout}ms`; // Vespa expects format like "5s" or "5000ms"
    if (params.route) queryParams["route"] = params.route;
    if (params.tracelevel) queryParams["tracelevel"] = params.tracelevel;
    if (params.condition) queryParams["condition"] = params.condition;
    if (params.create !== undefined) queryParams["create"] = params.create; // Typically true for POST, but allow override

    return httpClient.request<VespaResponse>(
        "POST",
        path,
        queryParams,
        params.fields,
        undefined, // No extra headers
        "feed"     // Operation type
    );
}

/**
 * Performs a single update operation.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the update operation.
 * @returns A promise resolving to the update response.
 */
export async function updateOperation(httpClient: VespaHttpClient, params: UpdateDocumentParams): Promise<VespaResponse> {
    if (!params.fields) {
        throw new VespaConfigurationError("Missing 'fields' for update operation.");
    }
    const docId = buildDocumentId(params.schema, params.dataId, params.namespace);
    const path = `/document/v1/${encodeURIComponent(params.namespace ?? params.schema)}/${encodeURIComponent(params.schema)}/docid/${encodeURIComponent(params.dataId)}`;

    const queryParams: Record<string, any> = {};
    if (params.timeout) queryParams["timeout"] = `${params.timeout}ms`;
    if (params.route) queryParams["route"] = params.route;
    if (params.tracelevel) queryParams["tracelevel"] = params.tracelevel;
    if (params.condition) queryParams["condition"] = params.condition;
    if (params.createIfNotExists !== undefined) queryParams["create"] = params.createIfNotExists;

    // Vespa update uses PUT with a specific structure
    const updateBody = {
        fields: params.fields,
        // create: params.createIfNotExists // Also possible to put create flag here
    };

    return httpClient.request<VespaResponse>(
        "PUT",
        path,
        queryParams,
        updateBody,
        undefined, // No extra headers
        "update"   // Operation type
    );
}

/**
 * Performs a single delete operation.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the delete operation.
 * @returns A promise resolving to the delete response.
 */
export async function deleteOperation(httpClient: VespaHttpClient, params: DeleteDocumentParams): Promise<VespaResponse> {
    const docId = buildDocumentId(params.schema, params.dataId, params.namespace);
    const path = `/document/v1/${encodeURIComponent(params.namespace ?? params.schema)}/${encodeURIComponent(params.schema)}/docid/${encodeURIComponent(params.dataId)}`;

    const queryParams: Record<string, any> = {};
    if (params.timeout) queryParams["timeout"] = `${params.timeout}ms`;
    if (params.route) queryParams["route"] = params.route;
    if (params.tracelevel) queryParams["tracelevel"] = params.tracelevel;
    if (params.condition) queryParams["condition"] = params.condition;

    return httpClient.request<VespaResponse>(
        "DELETE",
        path,
        queryParams,
        undefined, // No request body
        undefined, // No extra headers
        "delete"   // Operation type
    );
}

/**
 * Feeds documents from an async iterable source concurrently.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param iter - An async iterable yielding document parameters.
 * @param options - Options controlling the feeding process.
 * @returns A promise that resolves when all documents have been processed.
 */
export async function feedIterable(
    httpClient: VespaHttpClient,
    iter: AsyncIterable<FeedDocumentParams | UpdateDocumentParams | DeleteDocumentParams>,
    options: FeedIterableOptions
): Promise<void> {
    const { schema, namespace, operationType = "feed", maxWorkers = 50, callback, ...commonParams } = options;

    if (!schema) {
        throw new VespaConfigurationError("Schema must be provided in FeedIterableOptions.");
    }

    const limit = pLimit(maxWorkers);
    const promises: Promise<void>[] = [];

    async function processDoc(doc: FeedDocumentParams | UpdateDocumentParams | DeleteDocumentParams): Promise<void> {
        const docId = doc.dataId; // Keep user-provided ID for callback
        let response: VespaResponse | Error;
        try {
            const paramsWithDefaults = { ...commonParams, ...doc, schema, namespace };
            switch (operationType) {
                case "feed":
                    response = await feedOperation(httpClient, paramsWithDefaults as FeedDocumentParams);
                    break;
                case "update":
                    response = await updateOperation(httpClient, paramsWithDefaults as UpdateDocumentParams);
                    break;
                case "delete":
                    response = await deleteOperation(httpClient, paramsWithDefaults as DeleteDocumentParams);
                    break;
                default:
                    throw new VespaConfigurationError(`Invalid operation type: ${operationType}`);
            }
        } catch (error: any) {
            response = error instanceof TsVespaError ? error : new TsVespaError(`Operation failed for id ${docId}: ${error.message}`);
        }

        if (callback) {
            try {
                callback(response, docId);
            } catch (callbackError: any) {
                // Log error in user callback but don't fail the whole process
                console.error(`Error in feedIterable callback for id ${docId}: ${callbackError.message}`);
            }
        }
    }

    for await (const doc of iter) {
        if (!doc.dataId) {
            const error = new VespaConfigurationError("Missing 'dataId' in document from iterable.");
            if (callback) {
                try { callback(error, "unknown"); } catch { /* Ignore callback error */ }
            }
            continue; // Skip this document
        }
        // Wrap the processing in the concurrency limiter
        promises.push(limit(() => processDoc(doc)));
    }

    // Wait for all scheduled operations to complete
    await Promise.all(promises);
}

