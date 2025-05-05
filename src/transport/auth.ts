// src/transport/auth.ts
import https from 'https';
import fs from 'fs';
import { VespaAuthenticationError } from '../utils/errors';

/**
 * Defines the types of authentication supported.
 */
export type AuthConfig = NoAuth | MTLSAuth | TokenAuth;

/**
 * Represents no authentication.
 */
export interface NoAuth {
    type: 'none';
}

/**
 * Represents Mutual TLS (mTLS) authentication.
 */
export interface MTLSAuth {
    type: 'mtls';
    /** Path to the client certificate file (.pem). */
    certPath: string;
    /** Path to the client key file (.pem). */
    keyPath: string;
    /** Optional path to the CA certificate file (.pem). */
    caCertPath?: string;
}

/**
 * Represents Token-based authentication.
 */
export interface TokenAuth {
    type: 'token';
    /** The secret token. */
    token: string;
}

/**
 * Creates an HTTPS agent configured for mTLS authentication.
 *
 * @param config - The mTLS authentication configuration.
 * @returns An https.Agent configured for mTLS.
 * @throws VespaAuthenticationError if certificate or key files cannot be read.
 */
export function createMTLSHTTPAgent(config: MTLSAuth): https.Agent {
    try {
        const agentOptions: https.AgentOptions = {
            cert: fs.readFileSync(config.certPath),
            key: fs.readFileSync(config.keyPath),
            rejectUnauthorized: config.caCertPath ? true : false, // Enforce CA validation only if CA cert is provided
        };
        if (config.caCertPath) {
            agentOptions.ca = fs.readFileSync(config.caCertPath);
        }
        return new https.Agent(agentOptions);
    } catch (error: any) {
        throw new VespaAuthenticationError(`Failed to read mTLS certificate or key files: ${error.message}`);
    }
}

/**
 * Gets the necessary headers for Token-based authentication.
 *
 * @param config - The Token authentication configuration.
 * @returns An object containing the Authorization header.
 */
export function getTokenAuthHeaders(config: TokenAuth): { [key: string]: string } {
    return {
        'Authorization': `Bearer ${config.token}`
    };
}

