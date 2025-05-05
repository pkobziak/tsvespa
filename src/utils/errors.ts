// src/utils/errors.ts

/**
 * Base class for all custom errors related to the tsvespa library.
 */
export class TsVespaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name; // Set the error name to the class name
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Represents an error originating from the Vespa HTTP API.
 */
export class VespaHttpError extends TsVespaError {
    public readonly statusCode: number;
    public readonly url: string;
    public readonly responseBody?: any; // Could be JSON error details or text

    constructor(message: string, statusCode: number, url: string, responseBody?: any) {
        super(`${message} (Status: ${statusCode}, URL: ${url})`);
        this.statusCode = statusCode;
        this.url = url;
        this.responseBody = responseBody;
    }
}

/**
 * Represents an error specifically parsed from Vespa's JSON error response format.
 */
export class VespaServerError extends VespaHttpError {
    public readonly vespaErrors?: any[]; // Structure from Vespa's "root.errors"

    constructor(message: string, statusCode: number, url: string, responseBody?: any, vespaErrors?: any[]) {
        super(message, statusCode, url, responseBody);
        this.vespaErrors = vespaErrors;
    }
}

/**
 * Represents an error related to authentication (e.g., invalid token, missing certs).
 */
export class VespaAuthenticationError extends TsVespaError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Represents an error during the application deployment process.
 */
export class VespaDeploymentError extends TsVespaError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Represents an error related to configuration or input validation.
 */
export class VespaConfigurationError extends TsVespaError {
    constructor(message: string) {
        super(message);
    }
}

