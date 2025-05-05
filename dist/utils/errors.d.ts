/**
 * Base class for all custom errors related to the ts-vespa library.
 */
export declare class TsVespaError extends Error {
    constructor(message: string);
}
/**
 * Represents an error originating from the Vespa HTTP API.
 */
export declare class VespaHttpError extends TsVespaError {
    readonly statusCode: number;
    readonly url: string;
    readonly responseBody?: any;
    constructor(message: string, statusCode: number, url: string, responseBody?: any);
}
/**
 * Represents an error specifically parsed from Vespa's JSON error response format.
 */
export declare class VespaServerError extends VespaHttpError {
    readonly vespaErrors?: any[];
    constructor(message: string, statusCode: number, url: string, responseBody?: any, vespaErrors?: any[]);
}
/**
 * Represents an error related to authentication (e.g., invalid token, missing certs).
 */
export declare class VespaAuthenticationError extends TsVespaError {
    constructor(message: string);
}
/**
 * Represents an error during the application deployment process.
 */
export declare class VespaDeploymentError extends TsVespaError {
    constructor(message: string);
}
/**
 * Represents an error related to configuration or input validation.
 */
export declare class VespaConfigurationError extends TsVespaError {
    constructor(message: string);
}
