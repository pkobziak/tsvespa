// src/operations/status.ts
import { VespaHttpClient } from "../transport/http";
import { VespaStatusResponse, VespaModelEndpointResponse } from "../types/vespa";

/**
 * Fetches the application status from the /ApplicationStatus endpoint.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @returns A promise resolving to the application status response.
 */
export async function getApplicationStatus(httpClient: VespaHttpClient): Promise<VespaStatusResponse> {
    // The response type T is specified here
    const response = await httpClient.request<VespaStatusResponse>(
        "GET",
        "/ApplicationStatus",
        undefined, // No query params
        undefined, // No request body
        undefined, // No extra headers
        "status"   // Operation type
    );

    // Add specific fields if needed, based on actual Vespa response structure
    // For now, assume the base VespaResponse structure + potential status field is sufficient
    // The casting in httpClient.handleResponse should handle the type correctly if T is passed.
    return response;
}

/**
 * Fetches the stateless model evaluation endpoints from /model-evaluation/v1/.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param modelId - Optional model ID to fetch a specific endpoint.
 * @returns A promise resolving to the model endpoint response.
 */
export async function getModelEndpoint(httpClient: VespaHttpClient, modelId?: string): Promise<VespaModelEndpointResponse> {
    let path = "/model-evaluation/v1/";
    if (modelId) {
        // Ensure modelId is properly URL-encoded if it can contain special characters
        path += encodeURIComponent(modelId);
    }

    const response = await httpClient.request<VespaModelEndpointResponse>(
        "GET",
        path,
        undefined, // No query params
        undefined, // No request body
        undefined, // No extra headers
        "modelEndpoint" // Operation type
    );

    // Add specific fields if needed, based on actual Vespa response structure
    return response;
}

