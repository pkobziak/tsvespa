// src/index.ts

// Export core classes and types for public use

export { VespaClient, VespaClientConfig } from "./client";
export { ApplicationPackage } from "./config/application";
export { Schema } from "./config/schema";

// Export operation parameters and response types
export * from "./types/vespa";

// Export authentication types
export * from "./transport/auth";

// Export error types
export * from "./utils/errors";

