"use strict";
// src/utils/errors.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.VespaConfigurationError = exports.VespaDeploymentError = exports.VespaAuthenticationError = exports.VespaServerError = exports.VespaHttpError = exports.TsVespaError = void 0;
/**
 * Base class for all custom errors related to the tsvespa library.
 */
class TsVespaError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name; // Set the error name to the class name
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.TsVespaError = TsVespaError;
/**
 * Represents an error originating from the Vespa HTTP API.
 */
class VespaHttpError extends TsVespaError {
    constructor(message, statusCode, url, responseBody) {
        super(`${message} (Status: ${statusCode}, URL: ${url})`);
        this.statusCode = statusCode;
        this.url = url;
        this.responseBody = responseBody;
    }
}
exports.VespaHttpError = VespaHttpError;
/**
 * Represents an error specifically parsed from Vespa's JSON error response format.
 */
class VespaServerError extends VespaHttpError {
    constructor(message, statusCode, url, responseBody, vespaErrors) {
        super(message, statusCode, url, responseBody);
        this.vespaErrors = vespaErrors;
    }
}
exports.VespaServerError = VespaServerError;
/**
 * Represents an error related to authentication (e.g., invalid token, missing certs).
 */
class VespaAuthenticationError extends TsVespaError {
    constructor(message) {
        super(message);
    }
}
exports.VespaAuthenticationError = VespaAuthenticationError;
/**
 * Represents an error during the application deployment process.
 */
class VespaDeploymentError extends TsVespaError {
    constructor(message) {
        super(message);
    }
}
exports.VespaDeploymentError = VespaDeploymentError;
/**
 * Represents an error related to configuration or input validation.
 */
class VespaConfigurationError extends TsVespaError {
    constructor(message) {
        super(message);
    }
}
exports.VespaConfigurationError = VespaConfigurationError;
//# sourceMappingURL=errors.js.map