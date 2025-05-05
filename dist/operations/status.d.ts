import { VespaHttpClient } from "../transport/http";
import { VespaStatusResponse, VespaModelEndpointResponse } from "../types/vespa";
/**
 * Fetches the application status from the /ApplicationStatus endpoint.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @returns A promise resolving to the application status response.
 */
export declare function getApplicationStatus(httpClient: VespaHttpClient): Promise<VespaStatusResponse>;
/**
 * Fetches the stateless model evaluation endpoints from /model-evaluation/v1/.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param modelId - Optional model ID to fetch a specific endpoint.
 * @returns A promise resolving to the model endpoint response.
 */
export declare function getModelEndpoint(httpClient: VespaHttpClient, modelId?: string): Promise<VespaModelEndpointResponse>;
