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
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryOperation = queryOperation;
const errors_1 = require("../utils/errors");
/**
 * Performs a query operation against the Vespa search endpoint.
 *
 * @param httpClient - The configured Vespa HTTP client.
 * @param params - Query parameters, including YQL or body.
 * @returns A promise resolving to the query response.
 */
function queryOperation(httpClient, params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const path = "/search/";
        let queryParams = Object.assign({}, ((_a = params.query) !== null && _a !== void 0 ? _a : {}));
        let body = params.body;
        // If YQL is provided in the body, move it to query params as Vespa expects
        if (body === null || body === void 0 ? void 0 : body.yql) {
            if (params.yql) {
                throw new errors_1.VespaConfigurationError("YQL cannot be specified in both 'yql' parameter and 'body.yql'.");
            }
            queryParams["yql"] = body.yql;
            // Remove yql from body to avoid sending it twice
            const { yql } = body, restBody = __rest(body, ["yql"]);
            body = Object.keys(restBody).length > 0 ? restBody : undefined;
        }
        else if (params.yql) {
            queryParams["yql"] = params.yql;
        }
        // Add other top-level params to the body if not already there
        // This mirrors pyvespa's behavior of merging kwargs into the body
        if (!body) {
            body = {};
        }
        for (const [key, value] of Object.entries(params)) {
            if (["yql", "query", "body", "groupname", "timeout", "route", "tracelevel", "ranking", "model"].includes(key)) {
                // Add known parameters to queryParams or body as appropriate
                if (value !== undefined) {
                    if (["timeout", "route", "tracelevel", "ranking", "model"].includes(key)) {
                        // These typically go into the body according to Vespa API
                        if (body[key] === undefined) { // Avoid overwriting if already set in body explicitly
                            body[key] = value;
                        }
                    }
                    else if (key === "groupname") {
                        // groupname is a query parameter for streaming search
                        queryParams["groupname"] = value;
                    }
                    // yql, query, body are handled above/implicitly
                }
            }
            else {
                // Add any other arbitrary params to the body
                if (body[key] === undefined) {
                    body[key] = value;
                }
            }
        }
        // Ensure body is undefined if empty
        if (Object.keys(body).length === 0) {
            body = undefined;
        }
        const response = yield httpClient.request(body ? "POST" : "GET", // Use POST if there is a body, GET otherwise
        path, queryParams, body, undefined, // No extra headers
        "query" // Operation type
        );
        // Post-process response to extract hits and totalCount for convenience
        // This mirrors pyvespa's VespaQueryResponse structure
        const hits = ((_c = (_b = response.json) === null || _b === void 0 ? void 0 : _b.root) === null || _c === void 0 ? void 0 : _c.children) || [];
        const totalCount = (_f = (_e = (_d = response.json) === null || _d === void 0 ? void 0 : _d.root) === null || _e === void 0 ? void 0 : _e.fields) === null || _f === void 0 ? void 0 : _f.totalCount;
        // Add these directly to the response object if they don't conflict
        // Or create a wrapper class/modify the interface if preferred
        response.hits = hits;
        response.totalCount = totalCount;
        response.root = (_g = response.json) === null || _g === void 0 ? void 0 : _g.root;
        return response;
    });
}
//# sourceMappingURL=query.js.map