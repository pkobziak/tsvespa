import { VespaHttpConfig } from "./transport/http";
import { AuthConfig } from "./transport/auth";
import { VespaResponse, VespaQueryResponse, VespaStatusResponse, VespaDeployResponse, VespaModelEndpointResponse, QueryParams, FeedDocumentParams, UpdateDocumentParams, DeleteDocumentParams, FeedIterableOptions, DeployOptions } from "./types/vespa";
import { ApplicationPackage } from "./config/application";
/**
 * Configuration for the VespaClient.
 */
export interface VespaClientConfig {
    /** The base URL of the Vespa endpoint (e.g., http://localhost:8080 or https://<instance>.<tenant>.<region>.vespa-app.cloud). */
    endpoint: string;
    /** Authentication configuration. Defaults to no authentication. */
    auth?: AuthConfig;
    /** An optional ApplicationPackage instance associated with this client. */
    applicationPackage?: ApplicationPackage;
    /** Optional HTTP client configuration overrides. */
    httpConfig?: Partial<Omit<VespaHttpConfig, "baseUrl" | "authConfig">>;
}
/**
 * The main client class for interacting with a Vespa application.
 */
export declare class VespaClient {
    private httpClient;
    private config;
    readonly applicationPackage?: ApplicationPackage;
    /**
     * Creates an instance of VespaClient.
     * @param config - Configuration for the client.
     */
    constructor(config: VespaClientConfig);
    /**
     * Sends a query request to the Vespa application.
     *
     * @param params - Query parameters.
     * @returns A promise resolving to the query response.
     */
    query(params: QueryParams): Promise<VespaQueryResponse>;
    /**
     * Feeds a single document to the Vespa application.
     *
     * @param params - Parameters for the feed operation.
     * @returns A promise resolving to the feed response.
     */
    feed(params: FeedDocumentParams): Promise<VespaResponse>;
    /**
     * Updates a single document in the Vespa application.
     *
     * @param params - Parameters for the update operation.
     * @returns A promise resolving to the update response.
     */
    update(params: UpdateDocumentParams): Promise<VespaResponse>;
    /**
     * Deletes a single document from the Vespa application.
     *
     * @param params - Parameters for the delete operation.
     * @returns A promise resolving to the delete response.
     */
    delete(params: DeleteDocumentParams): Promise<VespaResponse>;
    /**
     * Feeds documents from an async iterable source concurrently.
     *
     * @param iter - An async iterable yielding document parameters.
     * @param options - Options controlling the feeding process (concurrency, callbacks, etc.).
     * @returns A promise that resolves when all documents have been processed.
     */
    feedIterable(iter: AsyncIterable<FeedDocumentParams | UpdateDocumentParams | DeleteDocumentParams>, options: FeedIterableOptions): Promise<void>;
    /**
     * Checks the status of the Vespa application endpoint.
     *
     * @returns A promise resolving to the application status response.
     */
    getApplicationStatus(): Promise<VespaStatusResponse>;
    /**
     * Retrieves stateless model evaluation endpoints.
     *
     * @param modelId - Optional model ID to filter endpoints.
     * @returns A promise resolving to the model endpoint response.
     */
    getModelEndpoint(modelId?: string): Promise<VespaModelEndpointResponse>;
    /**
     * Deploys an application package to Vespa Cloud.
     * Requires appropriate authentication (Token or mTLS) to be configured.
     * Requires tenant and application name.
     *
     * @param appPackage - The ApplicationPackage to deploy.
     * @param options - Deployment options including the application name and tenant details.
     * @returns A promise resolving to the deployment response.
     * @throws VespaConfigurationError if required deployment info is missing.
     */
    deploy(appPackage: ApplicationPackage, options: DeployOptions): Promise<VespaDeployResponse>;
    /**
     * Attempts to infer the schema name from the associated ApplicationPackage.
     * Throws VespaConfigurationError if inference is not possible.
     *
     * @param operation - Name of the operation requesting inference (for error message).
     * @returns The inferred schema name.
     */
    private inferSchemaName;
    /**
     * Retrieves the Vespa Cloud tenant name.
     * Placeholder - needs implementation (e.g., from config, env var).
     *
     * @returns The tenant name or undefined.
     */
    private getTenantName;
}
