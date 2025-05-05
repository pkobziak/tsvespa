import https from 'https';
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
export declare function createMTLSHTTPAgent(config: MTLSAuth): https.Agent;
/**
 * Gets the necessary headers for Token-based authentication.
 *
 * @param config - The Token authentication configuration.
 * @returns An object containing the Authorization header.
 */
export declare function getTokenAuthHeaders(config: TokenAuth): {
    [key: string]: string;
};
