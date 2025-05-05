"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMTLSHTTPAgent = createMTLSHTTPAgent;
exports.getTokenAuthHeaders = getTokenAuthHeaders;
// src/transport/auth.ts
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const errors_1 = require("../utils/errors");
/**
 * Creates an HTTPS agent configured for mTLS authentication.
 *
 * @param config - The mTLS authentication configuration.
 * @returns An https.Agent configured for mTLS.
 * @throws VespaAuthenticationError if certificate or key files cannot be read.
 */
function createMTLSHTTPAgent(config) {
    try {
        const agentOptions = {
            cert: fs_1.default.readFileSync(config.certPath),
            key: fs_1.default.readFileSync(config.keyPath),
            rejectUnauthorized: config.caCertPath ? true : false, // Enforce CA validation only if CA cert is provided
        };
        if (config.caCertPath) {
            agentOptions.ca = fs_1.default.readFileSync(config.caCertPath);
        }
        return new https_1.default.Agent(agentOptions);
    }
    catch (error) {
        throw new errors_1.VespaAuthenticationError(`Failed to read mTLS certificate or key files: ${error.message}`);
    }
}
/**
 * Gets the necessary headers for Token-based authentication.
 *
 * @param config - The Token authentication configuration.
 * @returns An object containing the Authorization header.
 */
function getTokenAuthHeaders(config) {
    return {
        'Authorization': `Bearer ${config.token}`
    };
}
//# sourceMappingURL=auth.js.map