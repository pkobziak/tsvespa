// src/operations/deploy.ts
import { VespaHttpClient } from "../transport/http";
import { ApplicationPackage } from "../config/application";
import { DeployOptions, VespaDeployResponse } from "../types/vespa";
import { VespaDeploymentError, VespaAuthenticationError } from "../utils/errors";
import FormData from "form-data";

/**
 * Deploys an application package to Vespa Cloud.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param appPackage - The ApplicationPackage to deploy.
 * @param tenant - The Vespa Cloud tenant name.
 * @param options - Deployment options including application name.
 * @returns A promise resolving to the deployment response.
 */
export async function deployApplication(
    httpClient: VespaHttpClient,
    appPackage: ApplicationPackage,
    tenant: string,
    options: DeployOptions
): Promise<VespaDeployResponse> {

    // Ensure authentication is configured, as deployment requires it
    // This check might be better placed in the client method calling this
    if (httpClient["config"].authConfig.type === "none") { // Accessing private config - maybe refactor http client later
        throw new VespaAuthenticationError("Authentication (mTLS or Token) is required for Vespa Cloud deployment.");
    }

    const appName = options.applicationName;
    const instance = options.instance || "default"; // Default instance name

    // Vespa Cloud Deploy API endpoint
    // Example: https://cloud.vespa.ai/application/v4/tenant/pkobziak/application/appname/instance/default/deploy
    const path = `/application/v4/tenant/${encodeURIComponent(tenant)}/application/${encodeURIComponent(appName)}/instance/${encodeURIComponent(instance)}/deploy`;

    let zipBuffer: Buffer;
    try {
        zipBuffer = await appPackage.toZipBuffer();
    } catch (error: any) {
        throw new VespaDeploymentError(`Failed to create application package zip: ${error.message}`);
    }

    // Create multipart/form-data payload
    const form = new FormData();
    form.append("applicationZip", zipBuffer, {
        filename: "application.zip",
        contentType: "application/zip",
    });

    // Deployment API might have specific headers
    const headers = {
        ...form.getHeaders(), // Sets Content-Type to multipart/form-data with boundary
        // Add any other specific headers if required by Vespa Cloud API
    };

    try {
        // Use POST method for deployment
        const response = await httpClient.request<VespaDeployResponse>(
            "POST",
            path,
            undefined, // No query params
            form,      // Pass FormData object directly (axios handles it)
            headers,
            "deploy"   // Operation type
        );

        // Add specific fields if needed, based on actual Vespa deploy response
        // e.g., response.json?.sessionId, response.json?.message
        response.sessionId = response.json?.prepareAndActivateResponse?.sessionId ?? response.json?.sessionId;
        response.message = response.json?.message;
        // Potentially parse logs URL etc.

        if (!response.isSuccess()) {
             // Error should have been thrown by httpClient, but double-check
             throw new VespaDeploymentError(`Deployment failed with status ${response.statusCode}: ${response.text ?? JSON.stringify(response.json)}`);
        }

        console.log(`Deployment initiated for ${tenant}.${appName}.${instance}. Session ID: ${response.sessionId}`);
        // TODO: Implement polling for deployment status based on session ID?
        // pyvespa has wait_for_deployment

        return response;

    } catch (error: any) {
        if (error instanceof VespaDeploymentError || error instanceof VespaAuthenticationError) {
            throw error;
        }
        // Wrap other errors
        throw new VespaDeploymentError(`Deployment request failed: ${error.message}`);
    }
}

