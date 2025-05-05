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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VespaHttpClient = void 0;
// src/transport/http.ts
// Use default import for axios, type imports for types, and named import for isAxiosError
const axios_1 = __importDefault(require("axios"));
const axios_2 = require("axios"); // Import the function directly
const axios_retry_1 = __importDefault(require("axios-retry"));
const zlib_1 = __importDefault(require("zlib"));
const util_1 = require("util");
const auth_1 = require("./auth");
const errors_1 = require("../utils/errors");
const gzipAsync = (0, util_1.promisify)(zlib_1.default.gzip);
const gunzipAsync = (0, util_1.promisify)(zlib_1.default.gunzip);
/**
 * Implements the HTTP transport layer for interacting with Vespa APIs.
 * Uses axios for requests and handles authentication, retries, compression, and error mapping.
 */
class VespaHttpClient {
    constructor(config) {
        this.config = Object.assign({ retries: 3, retryDelay: 100, compressLimit: 1024, timeout: 10000 }, config);
        // Use imported types directly
        const axiosConfig = {
            baseURL: this.config.baseUrl,
            timeout: this.config.timeout,
            headers: {
                "User-Agent": `ts-vespa/0.1.0`, // TODO: Get version dynamically
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate",
            },
            responseType: "arraybuffer",
            transformResponse: [(data) => data],
        };
        if (this.config.authConfig.type === "mtls") {
            axiosConfig.httpsAgent = (0, auth_1.createMTLSHTTPAgent)(this.config.authConfig);
        }
        else if (this.config.authConfig.type === "token") {
            axiosConfig.headers = Object.assign(Object.assign({}, axiosConfig.headers), (0, auth_1.getTokenAuthHeaders)(this.config.authConfig));
        }
        this.axiosInstance = axios_1.default.create(axiosConfig);
        (0, axios_retry_1.default)(this.axiosInstance, {
            retries: this.config.retries,
            retryDelay: (retryCount) => {
                return (this.config.retryDelay || 100) * Math.pow(2, retryCount - 1) + Math.random() * (this.config.retryDelay || 100);
            },
            // Use imported types directly
            retryCondition: (error) => {
                var _a, _b;
                // Use imported isAxiosError for type guarding
                return (0, axios_2.isAxiosError)(error) && (axios_retry_1.default.isNetworkOrIdempotentRequestError(error) || ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 0) >= 500);
            },
        });
    }
    request(method_1, path_1, params_1, data_1, headers_1) {
        return __awaiter(this, arguments, void 0, function* (method, path, params, data, headers, operationType = "unknown") {
            var _a;
            // Use imported types directly
            const requestConfig = {
                method: method,
                url: path,
                params: params,
                headers: Object.assign({}, headers),
            };
            let requestData = data;
            if (requestData && typeof requestData.getHeaders === "function") {
                requestConfig.data = requestData;
                requestConfig.headers = Object.assign(Object.assign({}, requestConfig.headers), requestData.getHeaders());
            }
            else if (requestData) {
                const bodyString = JSON.stringify(requestData);
                const bodyBuffer = Buffer.from(bodyString, "utf-8");
                if (bodyBuffer.length > ((_a = this.config.compressLimit) !== null && _a !== void 0 ? _a : 1024)) {
                    try {
                        requestConfig.data = yield gzipAsync(bodyBuffer);
                        requestConfig.headers = requestConfig.headers || {};
                        requestConfig.headers["Content-Encoding"] = "gzip";
                        requestConfig.headers["Content-Type"] = "application/json; charset=utf-8";
                    }
                    catch (compressError) {
                        console.warn(`Failed to gzip request body: ${compressError.message}`);
                        requestConfig.data = bodyBuffer;
                        requestConfig.headers = requestConfig.headers || {};
                        requestConfig.headers["Content-Type"] = "application/json; charset=utf-8";
                    }
                }
                else {
                    requestConfig.data = bodyBuffer;
                    requestConfig.headers = requestConfig.headers || {};
                    requestConfig.headers["Content-Type"] = "application/json; charset=utf-8";
                }
            }
            try {
                // Use imported types directly
                const response = yield this.axiosInstance.request(requestConfig);
                return yield this.handleResponse(response, operationType);
            }
            catch (error) {
                // Use imported isAxiosError
                if ((0, axios_2.isAxiosError)(error)) {
                    throw this.handleAxiosError(error, requestConfig.url || path);
                }
                else {
                    throw new errors_1.TsVespaError(`Request setup failed: ${error.message}`);
                }
            }
        });
    }
    // Use imported types directly
    handleResponse(response, operationType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            let responseBody = response.data;
            let responseText;
            let responseJson;
            const contentEncoding = response.headers["content-encoding"];
            if (contentEncoding === "gzip" && responseBody && responseBody.length > 0) {
                try {
                    responseBody = yield gunzipAsync(responseBody);
                }
                catch (decompressError) {
                    console.warn(`Failed to decompress gzipped response: ${decompressError.message}. URL: ${response.config.url}`);
                }
            }
            try {
                if (responseBody) {
                    responseText = responseBody.toString("utf-8");
                    if (responseText) {
                        responseJson = JSON.parse(responseText);
                    }
                }
            }
            catch (parseError) {
                // Ignore
            }
            const isSuccess = response.status >= 200 && response.status < 300;
            if (!isSuccess && responseJson) {
                const vespaErrors = ((_a = responseJson.root) === null || _a === void 0 ? void 0 : _a.errors) || (Array.isArray(responseJson.errors) ? responseJson.errors : undefined);
                const message = responseJson.message || `Request failed with status ${response.status}`;
                if (vespaErrors) {
                    throw new errors_1.VespaServerError(message, response.status, ((_b = response.config) === null || _b === void 0 ? void 0 : _b.url) || "", responseJson, vespaErrors);
                }
                throw new errors_1.VespaHttpError(message, response.status, ((_c = response.config) === null || _c === void 0 ? void 0 : _c.url) || "", responseJson);
            }
            if (!isSuccess) {
                throw new errors_1.VespaHttpError(`Request failed with status ${response.status}`, response.status, ((_d = response.config) === null || _d === void 0 ? void 0 : _d.url) || "", responseText || responseJson);
            }
            const result = {
                statusCode: response.status,
                url: ((_e = response.config) === null || _e === void 0 ? void 0 : _e.url) || "",
                json: responseJson,
                text: responseText,
                isSuccess: () => isSuccess,
                operationType: operationType,
            };
            return result;
        });
    }
    // Use imported types directly
    handleAxiosError(error, url) {
        var _a;
        if (error.response) {
            let responseData = error.response.data;
            let responseText;
            let responseJson;
            let message = `Request failed with status ${error.response.status}`;
            if (responseData instanceof Buffer) {
                const contentEncoding = error.response.headers["content-encoding"];
                if (contentEncoding === "gzip" && responseData.length > 0) {
                    try {
                        responseData = zlib_1.default.gunzipSync(responseData);
                    }
                    catch ( /* Ignore */_b) { /* Ignore */ }
                }
                try {
                    // Ensure responseData is Buffer before calling toString
                    if (responseData instanceof Buffer) {
                        responseText = responseData.toString("utf-8");
                    }
                    if (responseText) {
                        responseJson = JSON.parse(responseText);
                        message = responseJson.message || message;
                    }
                }
                catch ( /* Ignore parsing error */_c) { /* Ignore parsing error */ }
            }
            else if (typeof responseData === "string") {
                responseText = responseData;
                try {
                    responseJson = JSON.parse(responseText);
                    message = responseJson.message || message;
                }
                catch ( /* Ignore */_d) { /* Ignore */ }
            }
            else if (responseData) {
                responseJson = responseData;
                message = responseJson.message || message;
            }
            const vespaErrors = ((_a = responseJson === null || responseJson === void 0 ? void 0 : responseJson.root) === null || _a === void 0 ? void 0 : _a.errors) || (Array.isArray(responseJson === null || responseJson === void 0 ? void 0 : responseJson.errors) ? responseJson.errors : undefined);
            if (vespaErrors) {
                return new errors_1.VespaServerError(message, error.response.status, url, responseJson, vespaErrors);
            }
            return new errors_1.VespaHttpError(message, error.response.status, url, responseText !== null && responseText !== void 0 ? responseText : responseJson);
        }
        else if (error.request) {
            return new errors_1.VespaHttpError(`No response received from server at ${url}. Error: ${error.message}`, 503, url);
        }
        else {
            return new errors_1.TsVespaError(`Request setup failed: ${error.message}`);
        }
    }
}
exports.VespaHttpClient = VespaHttpClient;
//# sourceMappingURL=http.js.map