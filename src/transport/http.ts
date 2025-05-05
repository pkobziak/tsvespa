// src/transport/http.ts
// Use default import for axios, type imports for types, and named import for isAxiosError
import axios from "axios";
// Import types directly
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { isAxiosError } from "axios"; // Import the function directly
import axiosRetry from "axios-retry";
import https from "https";
import zlib from "zlib";
import { promisify } from "util";

import { AuthConfig, createMTLSHTTPAgent, getTokenAuthHeaders } from "./auth";
import { VespaHttpError, VespaServerError, TsVespaError } from "../utils/errors";
import { VespaResponse } from "../types/vespa";

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);

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
export class VespaHttpClient {
    // Use imported types directly
    private axiosInstance: AxiosInstance;
    private config: VespaHttpConfig;

    constructor(config: VespaHttpConfig) {
        this.config = {
            retries: 3,
            retryDelay: 100,
            compressLimit: 1024,
            timeout: 10000,
            ...config,
        };

        // Use imported types directly
        const axiosConfig: AxiosRequestConfig = {
            baseURL: this.config.baseUrl,
            timeout: this.config.timeout,
            headers: {
                "User-Agent": `tsvespa/0.1.0`, // TODO: Get version dynamically
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate",
            },
            responseType: "arraybuffer",
            transformResponse: [(data: Buffer) => data],
        };

        if (this.config.authConfig.type === "mtls") {
            axiosConfig.httpsAgent = createMTLSHTTPAgent(this.config.authConfig);
        } else if (this.config.authConfig.type === "token") {
            axiosConfig.headers = {
                ...axiosConfig.headers,
                ...getTokenAuthHeaders(this.config.authConfig),
            };
        }

        this.axiosInstance = axios.create(axiosConfig);

        axiosRetry(this.axiosInstance, {
            retries: this.config.retries,
            retryDelay: (retryCount) => {
                return (this.config.retryDelay || 100) * Math.pow(2, retryCount - 1) + Math.random() * (this.config.retryDelay || 100);
            },
            // Use imported types directly
            retryCondition: (error: Error | AxiosError) => { // Widen type for initial check
                // Use imported isAxiosError for type guarding
                return isAxiosError(error) && (axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500);
            },
        });
    }

    async request<T extends VespaResponse>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        path: string,
        params?: Record<string, any>,
        data?: any,
        headers?: Record<string, string>,
        operationType: string = "unknown"
    ): Promise<T> {
        // Use imported types directly
        const requestConfig: AxiosRequestConfig = {
            method: method,
            url: path,
            params: params,
            headers: { ...headers },
        };

        let requestData = data;

        if (requestData && typeof requestData.getHeaders === "function") {
             requestConfig.data = requestData;
             requestConfig.headers = { ...requestConfig.headers, ...requestData.getHeaders() };
        } else if (requestData) {
            const bodyString = JSON.stringify(requestData);
            const bodyBuffer = Buffer.from(bodyString, "utf-8");

            if (bodyBuffer.length > (this.config.compressLimit ?? 1024)) {
                try {
                    requestConfig.data = await gzipAsync(bodyBuffer);
                    requestConfig.headers = requestConfig.headers || {};
                    requestConfig.headers["Content-Encoding"] = "gzip";
                    requestConfig.headers["Content-Type"] = "application/json; charset=utf-8";
                } catch (compressError: any) {
                    console.warn(`Failed to gzip request body: ${compressError.message}`);
                    requestConfig.data = bodyBuffer;
                    requestConfig.headers = requestConfig.headers || {};
                    requestConfig.headers["Content-Type"] = "application/json; charset=utf-8";
                }
            } else {
                requestConfig.data = bodyBuffer;
                requestConfig.headers = requestConfig.headers || {};
                requestConfig.headers["Content-Type"] = "application/json; charset=utf-8";
            }
        }

        try {
            // Use imported types directly
            const response: AxiosResponse<Buffer> = await this.axiosInstance.request(requestConfig);
            return await this.handleResponse<T>(response, operationType);
        } catch (error: any) {
            // Use imported isAxiosError
            if (isAxiosError(error)) {
                 throw this.handleAxiosError(error, requestConfig.url || path);
            } else {
                 throw new TsVespaError(`Request setup failed: ${error.message}`);
            }
        }
    }

    // Use imported types directly
    private async handleResponse<T extends VespaResponse>(response: AxiosResponse<Buffer>, operationType: string): Promise<T> {
        let responseBody = response.data;
        let responseText: string | undefined;
        let responseJson: any | undefined;

        const contentEncoding = response.headers["content-encoding"];
        if (contentEncoding === "gzip" && responseBody && responseBody.length > 0) {
            try {
                responseBody = await gunzipAsync(responseBody);
            } catch (decompressError: any) {
                console.warn(`Failed to decompress gzipped response: ${decompressError.message}. URL: ${response.config.url}`);
            }
        }

        try {
            if (responseBody) {
                responseText = responseBody.toString("utf-8");
                if (responseText) {
                    responseJson = JSON.parse(responseText);
                }
            }
        } catch (parseError) {
            // Ignore
        }

        const isSuccess = response.status >= 200 && response.status < 300;

        if (!isSuccess && responseJson) {
            const vespaErrors = responseJson.root?.errors || (Array.isArray(responseJson.errors) ? responseJson.errors : undefined);
            const message = responseJson.message || `Request failed with status ${response.status}`;
            if (vespaErrors) {
                throw new VespaServerError(message, response.status, response.config?.url || "", responseJson, vespaErrors);
            }
            throw new VespaHttpError(message, response.status, response.config?.url || "", responseJson);
        }

        if (!isSuccess) {
             throw new VespaHttpError(`Request failed with status ${response.status}`, response.status, response.config?.url || "", responseText || responseJson);
        }

        const result: VespaResponse = {
            statusCode: response.status,
            url: response.config?.url || "",
            json: responseJson,
            text: responseText,
            isSuccess: () => isSuccess,
            operationType: operationType,
        };

        return result as T;
    }

    // Use imported types directly
    private handleAxiosError(error: AxiosError, url: string): TsVespaError {
        if (error.response) {
            let responseData = error.response.data;
            let responseText: string | undefined;
            let responseJson: any | undefined;
            let message = `Request failed with status ${error.response.status}`;

            if (responseData instanceof Buffer) {
                 const contentEncoding = error.response.headers["content-encoding"];
                 if (contentEncoding === "gzip" && responseData.length > 0) {
                    try {
                        responseData = zlib.gunzipSync(responseData);
                    } catch { /* Ignore */ }
                 }
                 try {
                    // Ensure responseData is Buffer before calling toString
                    if (responseData instanceof Buffer) {
                        responseText = responseData.toString("utf-8");
                    }
                    if (responseText) {
                        responseJson = JSON.parse(responseText);
                        message = responseJson.message || message;
                    }
                 } catch { /* Ignore parsing error */ }
            } else if (typeof responseData === "string") {
                responseText = responseData;
                try {
                    responseJson = JSON.parse(responseText);
                    message = responseJson.message || message;
                } catch { /* Ignore */ }
            } else if (responseData) {
                responseJson = responseData;
                message = responseJson.message || message;
            }

            const vespaErrors = responseJson?.root?.errors || (Array.isArray(responseJson?.errors) ? responseJson.errors : undefined);
            if (vespaErrors) {
                return new VespaServerError(message, error.response.status, url, responseJson, vespaErrors);
            }
            return new VespaHttpError(message, error.response.status, url, responseText ?? responseJson);
        } else if (error.request) {
            return new VespaHttpError(`No response received from server at ${url}. Error: ${error.message}`, 503, url);
        } else {
            return new TsVespaError(`Request setup failed: ${error.message}`);
        }
    }
}

