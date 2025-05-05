"use strict";
// src/index.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = exports.ApplicationPackage = exports.VespaClient = void 0;
// Export core classes and types for public use
var client_1 = require("./client");
Object.defineProperty(exports, "VespaClient", { enumerable: true, get: function () { return client_1.VespaClient; } });
var application_1 = require("./config/application");
Object.defineProperty(exports, "ApplicationPackage", { enumerable: true, get: function () { return application_1.ApplicationPackage; } });
var schema_1 = require("./config/schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return schema_1.Schema; } });
// Export operation parameters and response types
__exportStar(require("./types/vespa"), exports);
// Export authentication types
__exportStar(require("./transport/auth"), exports);
// Export error types
__exportStar(require("./utils/errors"), exports);
//# sourceMappingURL=index.js.map