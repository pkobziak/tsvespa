# ts-vespa

A TypeScript client library for interacting with Vespa.ai, ported from the official Python library `pyvespa`.

This library allows you to connect to Vespa instances (local or cloud), manage application packages, feed data, execute queries, and deploy applications to Vespa Cloud from your Node.js applications.

## Features

*   Connect to Vespa instances via HTTP/HTTPS.
*   Authentication:
    *   Mutual TLS (mTLS) using client certificates.
    *   Token-based authentication for Vespa Cloud.
*   Data Operations:
    *   Feed, update, and delete individual documents.
    *   Efficiently feed data from async iterables with concurrency control.
*   Querying:
    *   Execute YQL queries or use structured query bodies.
    *   Supports standard Vespa query parameters (ranking, timeout, etc.).
*   Application Package Management:
    *   Define schemas and application configurations programmatically.
    *   Add files and directories to the package.
    *   Generate deployable zip archives.
*   Vespa Cloud Deployment:
    *   Deploy application packages directly to Vespa Cloud.
*   Status Checks:
    *   Check application status (`/ApplicationStatus`).
    *   Retrieve model evaluation endpoints.
*   Typed API: Leverages TypeScript for strong typing of requests and responses.
*   Error Handling: Provides custom error classes for Vespa-specific issues.

## Installation

```bash
npm install ts-vespa # Or yarn add ts-vespa (once published)
# Or install directly from the source directory if needed:
# npm install /path/to/ts-vespa
```

## Quick Start

```typescript
import { VespaClient, ApplicationPackage, Schema } from "ts-vespa"; // Adjust import path if installed locally

async function main() {
    // --- Configuration ---
    const endpoint = "http://localhost:8080"; // Or your Vespa Cloud endpoint

    // Example: No Auth (for local unsecured Vespa)
    const client = new VespaClient({ endpoint });

    /*
    // Example: Token Auth (for Vespa Cloud data plane)
    const clientWithToken = new VespaClient({
        endpoint: "https://your-instance.your-tenant.your-region.vespa-app.cloud",
        auth: {
            type: "token",
            token: process.env.VESPA_CLOUD_TOKEN || "your-secret-token"
        }
    });

    // Example: mTLS Auth (for Vespa Cloud data plane)
    const clientWithMTLS = new VespaClient({
        endpoint: "https://your-mtls-instance.your-tenant.your-region.vespa-app.cloud",
        auth: {
            type: "mtls",
            keyPath: "/path/to/data-plane-private-key.pem",
            certPath: "/path/to/data-plane-cert.pem",
            // caCertPath: "/path/to/ca-certs.pem" // Optional CA cert
        }
    });
    */

    // --- Define Application Package (Optional, needed for schema inference/deployment) ---
    const appPackage = new ApplicationPackage("myApp");
    const productSchema = new Schema(
        "product",
        `schema product {
            document product {
                field title type string { indexing: summary | index }
                field description type string { indexing: summary | index }
                field price type float { indexing: summary | attribute }
            }
        }`
    );
    appPackage.addSchema(productSchema);

    // Associate package with client (optional)
    const clientWithPackage = new VespaClient({ endpoint, applicationPackage: appPackage });

    // --- Check Status ---
    try {
        const status = await client.getApplicationStatus();
        console.log("Application Status:", status.json);
    } catch (error) {
        console.error("Failed to get status:", error);
        return;
    }

    // --- Feed Data ---
    const docId = "doc1";
    try {
        const feedResponse = await clientWithPackage.feed({
            // schema: "product", // Can be inferred if package is associated
            dataId: docId,
            fields: {
                title: "Sample Product",
                description: "This is a great product.",
                price: 99.99
            }
        });
        console.log(`Feed successful for ${docId}:`, feedResponse.statusCode);
    } catch (error) {
        console.error(`Feed failed for ${docId}:`, error);
    }

    // Wait briefly for the document to be indexed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- Query Data ---
    try {
        const queryResponse = await clientWithPackage.query({
            yql: "select * from product where title contains \"sample\"",
            // Alternatively, use body for more complex queries:
            // body: {
            //     yql: "select * from product where title contains \"sample\"",
            //     hits: 5,
            //     ranking: "my_rank_profile"
            // }
        });
        console.log("Query Results:");
        console.log(`Total Hits: ${queryResponse.totalCount}`);
        queryResponse.hits?.forEach(hit => {
            console.log(` - ID: ${hit.id}, Relevance: ${hit.relevance}, Fields:`, hit.fields);
        });
    } catch (error) {
        console.error("Query failed:", error);
    }

    // --- Update Data ---
    try {
        const updateResponse = await clientWithPackage.update({
            dataId: docId,
            fields: {
                price: { assign: 109.99 } // Use Vespa update operation
            }
        });
        console.log(`Update successful for ${docId}:`, updateResponse.statusCode);
    } catch (error) {
        console.error(`Update failed for ${docId}:`, error);
    }

    // --- Delete Data ---
    try {
        const deleteResponse = await clientWithPackage.delete({ dataId: docId });
        console.log(`Delete successful for ${docId}:`, deleteResponse.statusCode);
    } catch (error) {
        console.error(`Delete failed for ${docId}:`, error);
    }

    /*
    // --- Deploy to Vespa Cloud (Example) ---
    // Requires a client configured with Vespa Cloud endpoint and auth (Token or mTLS)
    try {
        const deployClient = new VespaClient({
             endpoint: "https://cloud.vespa.ai", // Use the main cloud API endpoint for deployment
             auth: { type: "token", token: process.env.VESPA_CLOUD_API_KEY || "your-api-key" }
        });

        const deployResponse = await deployClient.deploy(appPackage, {
            applicationName: "your-app-name",
            // tenant: "your-tenant" // Tenant might be inferred or needed explicitly
        });
        console.log("Deployment initiated:", deployResponse.message, "Session ID:", deployResponse.sessionId);
        // Add logic here to poll for deployment completion using the session ID
    } catch (error) {
        console.error("Deployment failed:", error);
    }
    */
}

main().catch(console.error);

```

## API Documentation

Detailed API documentation generated from source code comments can be found in the `/docs` directory (or will be available online once published).

*   **[`VespaClient`](./docs/classes/VespaClient.md):** The main entry point for interacting with Vespa.
*   **[`ApplicationPackage`](./docs/classes/ApplicationPackage.md):** Represents and manages Vespa application configuration files.
*   **[`Schema`](./docs/classes/Schema.md):** Represents a Vespa schema definition.
*   **[Types](./docs/modules.md):** Detailed interfaces for request parameters and response objects.
*   **[Errors](./docs/modules.md):** Custom error classes thrown by the library.

*(Note: The links above assume documentation is generated into the `/docs` directory using TypeDoc with a Markdown plugin.)*

## Key Concepts

### Authentication

*   **No Auth:** Use for local, unsecured Vespa instances.
*   **mTLS:** Use certificate/key pairs for secure data plane access (often used with Vespa Cloud).
*   **Token:** Use bearer tokens for data plane access (Vespa Cloud) or API key for control plane access (like deployment via `https://cloud.vespa.ai`). Ensure you use the correct token/key for the endpoint you are targeting.

### Application Package

The `ApplicationPackage` class helps you define your Vespa application configuration (schemas, `services.xml`, etc.) in code. You can add schemas, files, and directories. The `toZipBuffer()` or `toZipFile()` methods create the deployable archive.

### Feeding Data

*   `feed()`: For single documents.
*   `update()`: For partial updates to documents.
*   `delete()`: For removing documents.
*   `feedIterable()`: For high-throughput feeding from an `AsyncIterable`. It manages concurrency using `p-limit`.

### Querying

The `query()` method accepts a `yql` string or a more structured `body` object. It automatically uses GET for simple queries and POST for queries with a body.

### Deployment (Vespa Cloud)

The `deploy()` method requires:
1.  A client configured with the **Vespa Cloud control plane endpoint** (`https://cloud.vespa.ai`).
2.  Authentication suitable for the control plane (usually an **API Key** configured as a `TokenAuth`).
3.  An `ApplicationPackage` instance.
4.  Deployment options specifying the `applicationName` (and potentially `tenant`, `instance`).

It uploads the zipped application package and initiates the deployment process.

## Development

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Build: `npm run build` (Add a build script to `package.json`: `"build": "tsc"`)
4.  Test: `npm run test` (Requires setting up a test runner like Jest or Vitest)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This library is licensed under the Apache 2.0 License. See [LICENSE](./LICENSE) (TODO: Add LICENSE file based on pyvespa's).

