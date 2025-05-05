import { VespaHttpClient } from "../transport/http";
import { VespaResponse, FeedDocumentParams, UpdateDocumentParams, DeleteDocumentParams, FeedIterableOptions } from "../types/vespa";
/**
 * Performs a single feed operation (create or replace document).
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the feed operation.
 * @returns A promise resolving to the feed response.
 */
export declare function feedOperation(httpClient: VespaHttpClient, params: FeedDocumentParams): Promise<VespaResponse>;
/**
 * Performs a single update operation.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the update operation.
 * @returns A promise resolving to the update response.
 */
export declare function updateOperation(httpClient: VespaHttpClient, params: UpdateDocumentParams): Promise<VespaResponse>;
/**
 * Performs a single delete operation.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the delete operation.
 * @returns A promise resolving to the delete response.
 */
export declare function deleteOperation(httpClient: VespaHttpClient, params: DeleteDocumentParams): Promise<VespaResponse>;
/**
 * Feeds documents from an async iterable source concurrently.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param iter - An async iterable yielding document parameters.
 * @param options - Options controlling the feeding process.
 * @returns A promise that resolves when all documents have been processed.
 */
export declare function feedIterable(httpClient: VespaHttpClient, iter: AsyncIterable<FeedDocumentParams | UpdateDocumentParams | DeleteDocumentParams>, options: FeedIterableOptions): Promise<void>;
