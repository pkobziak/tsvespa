"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationStatus = getApplicationStatus;
exports.getModelEndpoint = getModelEndpoint;
/**
 * Fetches the application status from the /ApplicationStatus endpoint.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @returns A promise resolving to the application status response.
 */
function getApplicationStatus(httpClient) {
    return __awaiter(this, void 0, void 0, function* () {
        // The response type T is specified here
        const response = yield httpClient.request("GET", "/ApplicationStatus", undefined, // No query params
        undefined, // No request body
        undefined, // No extra headers
        "status" // Operation type
        );
        // Add specific fields if needed, based on actual Vespa response structure
        // For now, assume the base VespaResponse structure + potential status field is sufficient
        // The casting in httpClient.handleResponse should handle the type correctly if T is passed.
        return response;
    });
}
/**
 * Fetches the stateless model evaluation endpoints from /model-evaluation/v1/.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param modelId - Optional model ID to fetch a specific endpoint.
 * @returns A promise resolving to the model endpoint response.
 */
function getModelEndpoint(httpClient, modelId) {
    return __awaiter(this, void 0, void 0, function* () {
        let path = "/model-evaluation/v1/";
        if (modelId) {
            // Ensure modelId is properly URL-encoded if it can contain special characters
            path += encodeURIComponent(modelId);
        }
        const response = yield httpClient.request("GET", path, undefined, // No query params
        undefined, // No request body
        undefined, // No extra headers
        "modelEndpoint" // Operation type
        );
        // Add specific fields if needed, based on actual Vespa response structure
        return response;
    });
}
//# sourceMappingURL=status.js.map