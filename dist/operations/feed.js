"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedOperation = feedOperation;
exports.updateOperation = updateOperation;
exports.deleteOperation = deleteOperation;
exports.feedIterable = feedIterable;
// src/operations/feed.ts
const p_limit_1 = __importDefault(require("p-limit"));
const errors_1 = require("../utils/errors");
/**
 * Constructs the full Vespa document ID string.
 * Format: id:<namespace>:<schema>::<dataId>
 *
 * @param schema - The schema name.
 * @param dataId - The user-provided document ID part.
 * @param namespace - Optional namespace. Defaults to schema name.
 * @returns The fully qualified Vespa document ID.
 */
function buildDocumentId(schema, dataId, namespace) {
    const ns = namespace !== null && namespace !== void 0 ? namespace : schema;
    // Ensure parts don't contain problematic characters? Vespa handles most via URL encoding.
    return `id:${ns}:${schema}::${dataId}`;
}
/**
 * Performs a single feed operation (create or replace document).
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the feed operation.
 * @returns A promise resolving to the feed response.
 */
function feedOperation(httpClient, params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!params.fields) {
            throw new errors_1.VespaConfigurationError("Missing 'fields' for feed operation.");
        }
        const docId = buildDocumentId(params.schema, params.dataId, params.namespace);
        const path = `/document/v1/${encodeURIComponent((_a = params.namespace) !== null && _a !== void 0 ? _a : params.schema)}/${encodeURIComponent(params.schema)}/docid/${encodeURIComponent(params.dataId)}`;
        const queryParams = {};
        if (params.timeout)
            queryParams["timeout"] = `${params.timeout}ms`; // Vespa expects format like "5s" or "5000ms"
        if (params.route)
            queryParams["route"] = params.route;
        if (params.tracelevel)
            queryParams["tracelevel"] = params.tracelevel;
        if (params.condition)
            queryParams["condition"] = params.condition;
        if (params.create !== undefined)
            queryParams["create"] = params.create; // Typically true for POST, but allow override
        return httpClient.request("POST", path, queryParams, params.fields, undefined, // No extra headers
        "feed" // Operation type
        );
    });
}
/**
 * Performs a single update operation.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the update operation.
 * @returns A promise resolving to the update response.
 */
function updateOperation(httpClient, params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!params.fields) {
            throw new errors_1.VespaConfigurationError("Missing 'fields' for update operation.");
        }
        const docId = buildDocumentId(params.schema, params.dataId, params.namespace);
        const path = `/document/v1/${encodeURIComponent((_a = params.namespace) !== null && _a !== void 0 ? _a : params.schema)}/${encodeURIComponent(params.schema)}/docid/${encodeURIComponent(params.dataId)}`;
        const queryParams = {};
        if (params.timeout)
            queryParams["timeout"] = `${params.timeout}ms`;
        if (params.route)
            queryParams["route"] = params.route;
        if (params.tracelevel)
            queryParams["tracelevel"] = params.tracelevel;
        if (params.condition)
            queryParams["condition"] = params.condition;
        if (params.createIfNotExists !== undefined)
            queryParams["create"] = params.createIfNotExists;
        // Vespa update uses PUT with a specific structure
        const updateBody = {
            fields: params.fields,
            // create: params.createIfNotExists // Also possible to put create flag here
        };
        return httpClient.request("PUT", path, queryParams, updateBody, undefined, // No extra headers
        "update" // Operation type
        );
    });
}
/**
 * Performs a single delete operation.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Parameters for the delete operation.
 * @returns A promise resolving to the delete response.
 */
function deleteOperation(httpClient, params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const docId = buildDocumentId(params.schema, params.dataId, params.namespace);
        const path = `/document/v1/${encodeURIComponent((_a = params.namespace) !== null && _a !== void 0 ? _a : params.schema)}/${encodeURIComponent(params.schema)}/docid/${encodeURIComponent(params.dataId)}`;
        const queryParams = {};
        if (params.timeout)
            queryParams["timeout"] = `${params.timeout}ms`;
        if (params.route)
            queryParams["route"] = params.route;
        if (params.tracelevel)
            queryParams["tracelevel"] = params.tracelevel;
        if (params.condition)
            queryParams["condition"] = params.condition;
        return httpClient.request("DELETE", path, queryParams, undefined, // No request body
        undefined, // No extra headers
        "delete" // Operation type
        );
    });
}
/**
 * Feeds documents from an async iterable source concurrently.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param iter - An async iterable yielding document parameters.
 * @param options - Options controlling the feeding process.
 * @returns A promise that resolves when all documents have been processed.
 */
function feedIterable(httpClient, iter, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, iter_1, iter_1_1;
        var _b, e_1, _c, _d;
        const { schema, namespace, operationType = "feed", maxWorkers = 50, callback } = options, commonParams = __rest(options, ["schema", "namespace", "operationType", "maxWorkers", "callback"]);
        if (!schema) {
            throw new errors_1.VespaConfigurationError("Schema must be provided in FeedIterableOptions.");
        }
        const limit = (0, p_limit_1.default)(maxWorkers);
        const promises = [];
        function processDoc(doc) {
            return __awaiter(this, void 0, void 0, function* () {
                const docId = doc.dataId; // Keep user-provided ID for callback
                let response;
                try {
                    const paramsWithDefaults = Object.assign(Object.assign(Object.assign({}, commonParams), doc), { schema, namespace });
                    switch (operationType) {
                        case "feed":
                            response = yield feedOperation(httpClient, paramsWithDefaults);
                            break;
                        case "update":
                            response = yield updateOperation(httpClient, paramsWithDefaults);
                            break;
                        case "delete":
                            response = yield deleteOperation(httpClient, paramsWithDefaults);
                            break;
                        default:
                            throw new errors_1.VespaConfigurationError(`Invalid operation type: ${operationType}`);
                    }
                }
                catch (error) {
                    response = error instanceof errors_1.TsVespaError ? error : new errors_1.TsVespaError(`Operation failed for id ${docId}: ${error.message}`);
                }
                if (callback) {
                    try {
                        callback(response, docId);
                    }
                    catch (callbackError) {
                        // Log error in user callback but don't fail the whole process
                        console.error(`Error in feedIterable callback for id ${docId}: ${callbackError.message}`);
                    }
                }
            });
        }
        try {
            for (_a = true, iter_1 = __asyncValues(iter); iter_1_1 = yield iter_1.next(), _b = iter_1_1.done, !_b; _a = true) {
                _d = iter_1_1.value;
                _a = false;
                const doc = _d;
                if (!doc.dataId) {
                    const error = new errors_1.VespaConfigurationError("Missing 'dataId' in document from iterable.");
                    if (callback) {
                        try {
                            callback(error, "unknown");
                        }
                        catch ( /* Ignore callback error */_e) { /* Ignore callback error */ }
                    }
                    continue; // Skip this document
                }
                // Wrap the processing in the concurrency limiter
                promises.push(limit(() => processDoc(doc)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = iter_1.return)) yield _c.call(iter_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Wait for all scheduled operations to complete
        yield Promise.all(promises);
    });
}
//# sourceMappingURL=feed.js.map