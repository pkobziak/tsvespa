// src/client.ts
import { VespaHttpClient, VespaHttpConfig } from "./transport/http";
import { AuthConfig, NoAuth } from "./transport/auth";
import {
    VespaResponse, VespaQueryResponse, VespaStatusResponse, VespaDeployResponse, VespaModelEndpointResponse,
    QueryParams, FeedDocumentParams, UpdateDocumentParams, DeleteDocumentParams, FeedIterableOptions, DeployOptions
} from "./types/vespa";
import { ApplicationPackage } from "./config/application"; // Assuming this will be created
import { feedIterable, feedOperation, updateOperation, deleteOperation } from "./operations/feed";
import { queryOperation } from "./operations/query";
import { deployApplication } from "./operations/deploy";
import { getApplicationStatus, getModelEndpoint } from "./operations/status";
import { VespaConfigurationError } from "./utils/errors";

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
export class VespaClient {
    private httpClient: VespaHttpClient;
    private config: VespaClientConfig;
    public readonly applicationPackage?: ApplicationPackage;

    /**
     * Creates an instance of VespaClient.
     * @param config - Configuration for the client.
     */
    constructor(config: VespaClientConfig) {
        this.config = config;
        this.applicationPackage = config.applicationPackage;

        const authConfig = config.auth ?? { type: "none" } as NoAuth;

        const httpConfig: VespaHttpConfig = {
            baseUrl: config.endpoint,
            authConfig: authConfig,
            ...(config.httpConfig ?? {}),
        };

        this.httpClient = new VespaHttpClient(httpConfig);
    }

    /**
     * Sends a query request to the Vespa application.
     *
     * @param params - Query parameters.
     * @returns A promise resolving to the query response.
     */
    async query(params: QueryParams): Promise<VespaQueryResponse> {
        return queryOperation(this.httpClient, params);
    }

    /**
     * Feeds a single document to the Vespa application.
     *
     * @param params - Parameters for the feed operation.
     * @returns A promise resolving to the feed response.
     */
    async feed(params: FeedDocumentParams): Promise<VespaResponse> {
        const schema = params.schema ?? this.inferSchemaName("feed");
        return feedOperation(this.httpClient, { ...params, schema });
    }

    /**
     * Updates a single document in the Vespa application.
     *
     * @param params - Parameters for the update operation.
     * @returns A promise resolving to the update response.
     */
    async update(params: UpdateDocumentParams): Promise<VespaResponse> {
        const schema = params.schema ?? this.inferSchemaName("update");
        return updateOperation(this.httpClient, { ...params, schema });
    }

    /**
     * Deletes a single document from the Vespa application.
     *
     * @param params - Parameters for the delete operation.
     * @returns A promise resolving to the delete response.
     */
    async delete(params: DeleteDocumentParams): Promise<VespaResponse> {
        const schema = params.schema ?? this.inferSchemaName("delete");
        return deleteOperation(this.httpClient, { ...params, schema });
    }

    /**
     * Feeds documents from an async iterable source concurrently.
     *
     * @param iter - An async iterable yielding document parameters.
     * @param options - Options controlling the feeding process (concurrency, callbacks, etc.).
     * @returns A promise that resolves when all documents have been processed.
     */
    async feedIterable(iter: AsyncIterable<FeedDocumentParams | UpdateDocumentParams | DeleteDocumentParams>, options: FeedIterableOptions): Promise<void> {
        const schema = options.schema ?? this.inferSchemaName(`feedIterable (${options.operationType || "feed"})`);
        // Pass the client instance itself, or just the httpClient?
        // Passing httpClient is cleaner separation of concerns.
        return feedIterable(this.httpClient, iter, { ...options, schema });
    }

    /**
     * Checks the status of the Vespa application endpoint.
     *
     * @returns A promise resolving to the application status response.
     */
    async getApplicationStatus(): Promise<VespaStatusResponse> {
        return getApplicationStatus(this.httpClient);
    }

    /**
     * Retrieves stateless model evaluation endpoints.
     *
     * @param modelId - Optional model ID to filter endpoints.
     * @returns A promise resolving to the model endpoint response.
     */
    async getModelEndpoint(modelId?: string): Promise<VespaModelEndpointResponse> {
        return getModelEndpoint(this.httpClient, modelId);
    }

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
    async deploy(appPackage: ApplicationPackage, options: DeployOptions): Promise<VespaDeployResponse> {
        // Tenant info might need to be part of the client config or deploy options
        // Pyvespa gets tenant/app from VespaCloud class init.
        // Let's require it in DeployOptions for now, along with app name.
        const tenant = this.getTenantName(); // Need a way to get this, maybe from config or env?

        if (!tenant) {
            throw new VespaConfigurationError("Vespa Cloud tenant name is required for deployment but was not found.");
        }
        if (!options.applicationName) {
            throw new VespaConfigurationError("Vespa Cloud application name is required for deployment.");
        }

        return deployApplication(this.httpClient, appPackage, tenant, options);
    }

    /**
     * Attempts to infer the schema name from the associated ApplicationPackage.
     * Throws VespaConfigurationError if inference is not possible.
     *
     * @param operation - Name of the operation requesting inference (for error message).
     * @returns The inferred schema name.
     */
    private inferSchemaName(operation: string): string {
        if (!this.applicationPackage) {
            throw new VespaConfigurationError(`Schema name must be provided for ${operation} operation when no ApplicationPackage is associated with the client.`);
        }
        const schemas = this.applicationPackage.schemas; // Assuming schemas is an array or map
        if (!schemas || Object.keys(schemas).length === 0) {
            throw new VespaConfigurationError(`Cannot infer schema name for ${operation}: ApplicationPackage has no schemas.`);
        }
        if (Object.keys(schemas).length > 1) {
            throw new VespaConfigurationError(`Cannot infer schema name for ${operation}: ApplicationPackage has multiple schemas. Please specify the schema explicitly.`);
        }
        // Assuming schemas is a Map<string, Schema> or Record<string, Schema>
        return Object.keys(schemas)[0];
    }

    /**
     * Retrieves the Vespa Cloud tenant name.
     * Placeholder - needs implementation (e.g., from config, env var).
     *
     * @returns The tenant name or undefined.
     */
    private getTenantName(): string | undefined {
        // TODO: Implement logic to retrieve tenant name
        // Potential sources: client config, environment variable (VESPA_CLOUD_TENANT)
        // For now, return placeholder based on knowledge module
        return "pkobziak";
    }
}

// Example of how ApplicationPackage might look (needs implementation in config/application.ts)
// interface ApplicationPackage {
//     name: string;
//     schemas: Record<string, any>; // Replace 'any' with actual Schema type
//     // other fields like servicesXml, hostsXml, etc.
//     compress(): Promise<Buffer>; // Method to create the deployable zip
// }

