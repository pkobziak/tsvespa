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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployApplication = deployApplication;
const errors_1 = require("../utils/errors");
const form_data_1 = __importDefault(require("form-data"));
/**
 * Deploys an application package to Vespa Cloud.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param appPackage - The ApplicationPackage to deploy.
 * @param tenant - The Vespa Cloud tenant name.
 * @param options - Deployment options including application name.
 * @returns A promise resolving to the deployment response.
 */
function deployApplication(httpClient, appPackage, tenant, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        // Ensure authentication is configured, as deployment requires it
        // This check might be better placed in the client method calling this
        if (httpClient["config"].authConfig.type === "none") { // Accessing private config - maybe refactor http client later
            throw new errors_1.VespaAuthenticationError("Authentication (mTLS or Token) is required for Vespa Cloud deployment.");
        }
        const appName = options.applicationName;
        const instance = options.instance || "default"; // Default instance name
        // Vespa Cloud Deploy API endpoint
        // Example: https://cloud.vespa.ai/application/v4/tenant/pkobziak/application/appname/instance/default/deploy
        const path = `/application/v4/tenant/${encodeURIComponent(tenant)}/application/${encodeURIComponent(appName)}/instance/${encodeURIComponent(instance)}/deploy`;
        let zipBuffer;
        try {
            zipBuffer = yield appPackage.toZipBuffer();
        }
        catch (error) {
            throw new errors_1.VespaDeploymentError(`Failed to create application package zip: ${error.message}`);
        }
        // Create multipart/form-data payload
        const form = new form_data_1.default();
        form.append("applicationZip", zipBuffer, {
            filename: "application.zip",
            contentType: "application/zip",
        });
        // Deployment API might have specific headers
        const headers = Object.assign({}, form.getHeaders());
        try {
            // Use POST method for deployment
            const response = yield httpClient.request("POST", path, undefined, // No query params
            form, // Pass FormData object directly (axios handles it)
            headers, "deploy" // Operation type
            );
            // Add specific fields if needed, based on actual Vespa deploy response
            // e.g., response.json?.sessionId, response.json?.message
            response.sessionId = (_c = (_b = (_a = response.json) === null || _a === void 0 ? void 0 : _a.prepareAndActivateResponse) === null || _b === void 0 ? void 0 : _b.sessionId) !== null && _c !== void 0 ? _c : (_d = response.json) === null || _d === void 0 ? void 0 : _d.sessionId;
            response.message = (_e = response.json) === null || _e === void 0 ? void 0 : _e.message;
            // Potentially parse logs URL etc.
            if (!response.isSuccess()) {
                // Error should have been thrown by httpClient, but double-check
                throw new errors_1.VespaDeploymentError(`Deployment failed with status ${response.statusCode}: ${(_f = response.text) !== null && _f !== void 0 ? _f : JSON.stringify(response.json)}`);
            }
            console.log(`Deployment initiated for ${tenant}.${appName}.${instance}. Session ID: ${response.sessionId}`);
            // TODO: Implement polling for deployment status based on session ID?
            // pyvespa has wait_for_deployment
            return response;
        }
        catch (error) {
            if (error instanceof errors_1.VespaDeploymentError || error instanceof errors_1.VespaAuthenticationError) {
                throw error;
            }
            // Wrap other errors
            throw new errors_1.VespaDeploymentError(`Deployment request failed: ${error.message}`);
        }
    });
}
//# sourceMappingURL=deploy.js.map