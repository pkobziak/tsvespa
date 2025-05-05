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
exports.VespaClient = void 0;
// src/client.ts
const http_1 = require("./transport/http");
const feed_1 = require("./operations/feed");
const query_1 = require("./operations/query");
const deploy_1 = require("./operations/deploy");
const status_1 = require("./operations/status");
const errors_1 = require("./utils/errors");
/**
 * The main client class for interacting with a Vespa application.
 */
class VespaClient {
    /**
     * Creates an instance of VespaClient.
     * @param config - Configuration for the client.
     */
    constructor(config) {
        var _a, _b;
        this.config = config;
        this.applicationPackage = config.applicationPackage;
        const authConfig = (_a = config.auth) !== null && _a !== void 0 ? _a : { type: "none" };
        const httpConfig = Object.assign({ baseUrl: config.endpoint, authConfig: authConfig }, ((_b = config.httpConfig) !== null && _b !== void 0 ? _b : {}));
        this.httpClient = new http_1.VespaHttpClient(httpConfig);
    }
    /**
     * Sends a query request to the Vespa application.
     *
     * @param params - Query parameters.
     * @returns A promise resolving to the query response.
     */
    query(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, query_1.queryOperation)(this.httpClient, params);
        });
    }
    /**
     * Feeds a single document to the Vespa application.
     *
     * @param params - Parameters for the feed operation.
     * @returns A promise resolving to the feed response.
     */
    feed(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const schema = (_a = params.schema) !== null && _a !== void 0 ? _a : this.inferSchemaName("feed");
            return (0, feed_1.feedOperation)(this.httpClient, Object.assign(Object.assign({}, params), { schema }));
        });
    }
    /**
     * Updates a single document in the Vespa application.
     *
     * @param params - Parameters for the update operation.
     * @returns A promise resolving to the update response.
     */
    update(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const schema = (_a = params.schema) !== null && _a !== void 0 ? _a : this.inferSchemaName("update");
            return (0, feed_1.updateOperation)(this.httpClient, Object.assign(Object.assign({}, params), { schema }));
        });
    }
    /**
     * Deletes a single document from the Vespa application.
     *
     * @param params - Parameters for the delete operation.
     * @returns A promise resolving to the delete response.
     */
    delete(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const schema = (_a = params.schema) !== null && _a !== void 0 ? _a : this.inferSchemaName("delete");
            return (0, feed_1.deleteOperation)(this.httpClient, Object.assign(Object.assign({}, params), { schema }));
        });
    }
    /**
     * Feeds documents from an async iterable source concurrently.
     *
     * @param iter - An async iterable yielding document parameters.
     * @param options - Options controlling the feeding process (concurrency, callbacks, etc.).
     * @returns A promise that resolves when all documents have been processed.
     */
    feedIterable(iter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const schema = (_a = options.schema) !== null && _a !== void 0 ? _a : this.inferSchemaName(`feedIterable (${options.operationType || "feed"})`);
            // Pass the client instance itself, or just the httpClient?
            // Passing httpClient is cleaner separation of concerns.
            return (0, feed_1.feedIterable)(this.httpClient, iter, Object.assign(Object.assign({}, options), { schema }));
        });
    }
    /**
     * Checks the status of the Vespa application endpoint.
     *
     * @returns A promise resolving to the application status response.
     */
    getApplicationStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, status_1.getApplicationStatus)(this.httpClient);
        });
    }
    /**
     * Retrieves stateless model evaluation endpoints.
     *
     * @param modelId - Optional model ID to filter endpoints.
     * @returns A promise resolving to the model endpoint response.
     */
    getModelEndpoint(modelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, status_1.getModelEndpoint)(this.httpClient, modelId);
        });
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
    deploy(appPackage, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Tenant info might need to be part of the client config or deploy options
            // Pyvespa gets tenant/app from VespaCloud class init.
            // Let's require it in DeployOptions for now, along with app name.
            const tenant = this.getTenantName(); // Need a way to get this, maybe from config or env?
            if (!tenant) {
                throw new errors_1.VespaConfigurationError("Vespa Cloud tenant name is required for deployment but was not found.");
            }
            if (!options.applicationName) {
                throw new errors_1.VespaConfigurationError("Vespa Cloud application name is required for deployment.");
            }
            return (0, deploy_1.deployApplication)(this.httpClient, appPackage, tenant, options);
        });
    }
    /**
     * Attempts to infer the schema name from the associated ApplicationPackage.
     * Throws VespaConfigurationError if inference is not possible.
     *
     * @param operation - Name of the operation requesting inference (for error message).
     * @returns The inferred schema name.
     */
    inferSchemaName(operation) {
        if (!this.applicationPackage) {
            throw new errors_1.VespaConfigurationError(`Schema name must be provided for ${operation} operation when no ApplicationPackage is associated with the client.`);
        }
        const schemas = this.applicationPackage.schemas; // Assuming schemas is an array or map
        if (!schemas || Object.keys(schemas).length === 0) {
            throw new errors_1.VespaConfigurationError(`Cannot infer schema name for ${operation}: ApplicationPackage has no schemas.`);
        }
        if (Object.keys(schemas).length > 1) {
            throw new errors_1.VespaConfigurationError(`Cannot infer schema name for ${operation}: ApplicationPackage has multiple schemas. Please specify the schema explicitly.`);
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
    getTenantName() {
        // TODO: Implement logic to retrieve tenant name
        // Potential sources: client config, environment variable (VESPA_CLOUD_TENANT)
        // For now, return placeholder based on knowledge module
        return "pkobziak";
    }
}
exports.VespaClient = VespaClient;
// Example of how ApplicationPackage might look (needs implementation in config/application.ts)
// interface ApplicationPackage {
//     name: string;
//     schemas: Record<string, any>; // Replace 'any' with actual Schema type
//     // other fields like servicesXml, hostsXml, etc.
//     compress(): Promise<Buffer>; // Method to create the deployable zip
// }
//# sourceMappingURL=client.js.map