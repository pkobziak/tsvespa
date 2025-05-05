import { AuthConfig } from "./auth";
import { VespaResponse } from "../types/vespa";
/**
 * Configuration options for the Vespa HTTP client.
 */
export interface VespaHttpConfig {
    /** Base URL of the Vespa endpoint (e.g., http://localhost:8080). */
    baseUrl: string;
    /** Authentication configuration. */
    authConfig: AuthConfig;
    /** Maximum number of retries for failed requests. Defaults to 3. */
    retries?: number;
    /** Initial delay between retries in milliseconds. Defaults to 100ms. */
    retryDelay?: number;
    /** Minimum size in bytes to consider compressing request body. Defaults to 1024. */
    compressLimit?: number;
    /** Default request timeout in milliseconds. Defaults to 10000 (10 seconds). */
    timeout?: number;
}
/**
 * Implements the HTTP transport layer for interacting with Vespa APIs.
 * Uses axios for requests and handles authentication, retries, compression, and error mapping.
 */
export declare class VespaHttpClient {
    private axiosInstance;
    private config;
    constructor(config: VespaHttpConfig);
    request<T extends VespaResponse>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, params?: Record<string, any>, data?: any, headers?: Record<string, string>, operationType?: string): Promise<T>;
    private handleResponse;
    private handleAxiosError;
}
