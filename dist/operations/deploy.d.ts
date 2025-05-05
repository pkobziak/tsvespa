import { VespaHttpClient } from "../transport/http";
import { ApplicationPackage } from "../config/application";
import { DeployOptions, VespaDeployResponse } from "../types/vespa";
/**
 * Deploys an application package to Vespa Cloud.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param appPackage - The ApplicationPackage to deploy.
 * @param tenant - The Vespa Cloud tenant name.
 * @param options - Deployment options including application name.
 * @returns A promise resolving to the deployment response.
 */
export declare function deployApplication(httpClient: VespaHttpClient, appPackage: ApplicationPackage, tenant: string, options: DeployOptions): Promise<VespaDeployResponse>;
