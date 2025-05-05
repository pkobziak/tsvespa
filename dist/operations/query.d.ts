import { VespaHttpClient } from "../transport/http";
import { QueryParams, VespaQueryResponse } from "../types/vespa";
/**
 * Performs a query operation against the Vespa search endpoint.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Query parameters, including YQL or body.
 * @returns A promise resolving to the query response.
 */
export declare function queryOperation(httpClient: VespaHttpClient, params: QueryParams): Promise<VespaQueryResponse>;
