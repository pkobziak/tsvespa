// src/operations/query.ts
import { VespaHttpClient } from "../transport/http";
import { QueryParams, VespaQueryResponse, VespaHit } from "../types/vespa";
import { VespaConfigurationError } from "../utils/errors";

/**
 * Performs a query operation against the Vespa search endpoint.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Query parameters, including YQL or body.
 * @returns A promise resolving to the query response.
 */
export async function queryOperation(httpClient: VespaHttpClient, params: QueryParams): Promise<VespaQueryResponse> {
    const path = "/search/";
    let queryParams: Record<string, any> = { ...(params.query ?? {}) };
    let body: Record<string, any> | undefined = params.body;

    // If YQL is provided in the body, move it to query params as Vespa expects
    if (body?.yql) {
        if (params.yql) {
            throw new VespaConfigurationError("YQL cannot be specified in both 'yql' parameter and 'body.yql'.");
        }
        queryParams["yql"] = body.yql;
        // Remove yql from body to avoid sending it twice
        const { yql, ...restBody } = body;
        body = Object.keys(restBody).length > 0 ? restBody : undefined;
    } else if (params.yql) {
        queryParams["yql"] = params.yql;
    }

    // Add other top-level params to the body if not already there
    // This mirrors pyvespa's behavior of merging kwargs into the body
    if (!body) {
        body = {};
    }
    for (const [key, value] of Object.entries(params)) {
        if (["yql", "query", "body", "groupname", "timeout", "route", "tracelevel", "ranking", "model"].includes(key)) {
            // Add known parameters to queryParams or body as appropriate
            if (value !== undefined) {
                if (["timeout", "route", "tracelevel", "ranking", "model"].includes(key)) {
                    // These typically go into the body according to Vespa API
                    if (body[key] === undefined) { // Avoid overwriting if already set in body explicitly
                       body[key] = value;
                    }
                } else if (key === "groupname") {
                    // groupname is a query parameter for streaming search
                    queryParams["groupname"] = value;
                }
                // yql, query, body are handled above/implicitly
            }
        } else {
            // Add any other arbitrary params to the body
            if (body[key] === undefined) {
               body[key] = value;
            }
        }
    }

    // Ensure body is undefined if empty
    if (Object.keys(body).length === 0) {
        body = undefined;
    }

    const response = await httpClient.request<VespaQueryResponse>(
        body ? "POST" : "GET", // Use POST if there is a body, GET otherwise
        path,
        queryParams,
        body,
        undefined, // No extra headers
        "query"    // Operation type
    );

    // Post-process response to extract hits and totalCount for convenience
    // This mirrors pyvespa's VespaQueryResponse structure
    const hits: VespaHit[] = response.json?.root?.children || [];
    const totalCount: number | undefined = response.json?.root?.fields?.totalCount;

    // Add these directly to the response object if they don't conflict
    // Or create a wrapper class/modify the interface if preferred
    response.hits = hits;
    response.totalCount = totalCount;
    response.root = response.json?.root;

    return response;
}

