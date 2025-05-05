"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ApplicationPackage = void 0;
// src/config/application.ts
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const archiver_1 = __importDefault(require("archiver"));
const schema_1 = require("./schema");
const errors_1 = require("../utils/errors");
/**
 * Represents a Vespa application package, containing configuration files like
 * schemas, services.xml, hosts.xml, etc.
 */
class ApplicationPackage {
    /**
     * Creates an ApplicationPackage instance.
     *
     * @param name - The name of the application package.
     */
    constructor(name) {
        this.files = new Map();
        if (!name) {
            throw new errors_1.VespaConfigurationError("ApplicationPackage name cannot be empty.");
        }
        this.name = name;
        // Add default empty files often expected by Vespa?
        // Or rely on user adding them explicitly.
        // Pyvespa adds default services.xml, hosts.xml, deployment.xml
        this.addFile("services.xml", this.defaultServicesXml());
        this.addFile("deployment.xml", this.defaultDeploymentXml());
        // hosts.xml is often generated based on nodes, maybe skip default?
    }
    /**
     * Adds a schema to the application package.
     *
     * @param schema - The Schema object to add.
     */
    addSchema(schema) {
        this.addFile(path.join("schemas", `${schema.name}.sd`), schema.content);
    }
    /**
     * Adds or replaces a file within the application package structure.
     *
     * @param relativePath - The path relative to the application package root (e.g., "services.xml", "schemas/my_schema.sd", "components/my_component.jar").
     * @param content - The content of the file (string or Buffer).
     */
    addFile(relativePath, content) {
        const normalizedPath = path.normalize(relativePath).replace(/^\.\.?\//, ""); // Basic normalization
        if (normalizedPath.startsWith("/") || normalizedPath.includes("..")) {
            throw new errors_1.VespaConfigurationError(`Invalid relative path: ${relativePath}`);
        }
        this.files.set(normalizedPath, { path: normalizedPath, content: content });
    }
    /**
     * Adds a directory and its contents recursively to the application package.
     * Files will be placed relative to the specified destination directory within the package.
     *
     * @param sourceDir - The absolute path to the local directory to add.
     * @param destinationDir - The relative path within the application package where the directory contents should be placed (e.g., "components", "search/query-profiles"). Defaults to the root.
     */
    addDirectory(sourceDir, destinationDir = ".") {
        if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
            throw new errors_1.VespaConfigurationError(`Source directory does not exist or is not a directory: ${sourceDir}`);
        }
        const normalizedDest = path.normalize(destinationDir).replace(/^\.\.?\//, "");
        if (normalizedDest.startsWith("/") || normalizedDest.includes("..")) {
            throw new errors_1.VespaConfigurationError(`Invalid relative destination directory: ${destinationDir}`);
        }
        const files = fs.readdirSync(sourceDir, { withFileTypes: true });
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file.name);
            const relativeDestPath = path.join(normalizedDest, file.name);
            if (file.isDirectory()) {
                this.addDirectory(sourcePath, relativeDestPath); // Recurse
            }
            else if (file.isFile()) {
                const content = fs.readFileSync(sourcePath);
                this.addFile(relativeDestPath, content);
            }
        }
    }
    /**
     * Retrieves the content of a specific file within the package.
     *
     * @param relativePath - The relative path of the file.
     * @returns The file content (string or Buffer), or undefined if not found.
     */
    getFileContent(relativePath) {
        var _a;
        const normalizedPath = path.normalize(relativePath).replace(/^\.\.?\//, "");
        return (_a = this.files.get(normalizedPath)) === null || _a === void 0 ? void 0 : _a.content;
    }
    /**
     * Gets a map of all schemas currently in the package.
     * Assumes schemas are stored under a "schemas/" directory with ".sd" extension.
     *
     * @returns A map where keys are schema names and values are Schema objects.
     */
    get schemas() {
        const schemaMap = new Map();
        for (const [filePath, fileData] of this.files.entries()) {
            if (filePath.startsWith("schemas/") && filePath.endsWith(".sd")) {
                const schemaName = path.basename(filePath, ".sd");
                if (typeof fileData.content === "string") {
                    schemaMap.set(schemaName, new schema_1.Schema(schemaName, fileData.content));
                }
                else {
                    // Handle buffer content if necessary, maybe decode?
                    console.warn(`Schema file ${filePath} has Buffer content, attempting to decode as UTF-8.`);
                    try {
                        const contentStr = fileData.content.toString("utf-8");
                        schemaMap.set(schemaName, new schema_1.Schema(schemaName, contentStr));
                    }
                    catch (e) {
                        console.error(`Failed to decode schema content for ${filePath}`);
                    }
                }
            }
        }
        return schemaMap;
    }
    /**
     * Generates the application package as a zipped Buffer, ready for deployment.
     *
     * @returns A promise resolving to a Buffer containing the zipped application package.
     */
    toZipBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const archive = (0, archiver_1.default)("zip", {
                    zlib: { level: 9 } // Maximum compression
                });
                const buffers = [];
                archive.on("data", (data) => buffers.push(data));
                archive.on("warning", (err) => console.warn("Archiver warning:", err));
                archive.on("error", (err) => reject(new errors_1.VespaConfigurationError(`Failed to create zip archive: ${err.message}`)));
                archive.on("end", () => resolve(Buffer.concat(buffers)));
                // Add all files to the archive
                for (const file of this.files.values()) {
                    archive.append(file.content, { name: file.path });
                }
                archive.finalize();
            });
        });
    }
    /**
     * Generates the application package as a zip file saved to the filesystem.
     *
     * @param targetPath - Optional path to save the zip file. Defaults to a temporary file.
     * @returns A promise resolving to the path where the zip file was saved.
     */
    toZipFile(targetPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputPath = targetPath || path.join(os.tmpdir(), `${this.name}-${Date.now()}.zip`);
            const output = fs.createWriteStream(outputPath);
            const archive = (0, archiver_1.default)("zip", {
                zlib: { level: 9 }
            });
            return new Promise((resolve, reject) => {
                output.on("close", () => resolve(outputPath));
                // output.on("end", () => console.log("Data has been drained")); // For debugging
                archive.on("warning", (err) => console.warn("Archiver warning:", err));
                archive.on("error", (err) => reject(new errors_1.VespaConfigurationError(`Failed to write zip file: ${err.message}`)));
                archive.pipe(output);
                for (const file of this.files.values()) {
                    archive.append(file.content, { name: file.path });
                }
                archive.finalize();
            });
        });
    }
    // --- Default file contents (similar to pyvespa) ---
    defaultServicesXml() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<services version="1.0" xmlns:deploy="vespa" xmlns:preprocess="properties">
    <container id="default" version="1.0">
        <search/>
        <document-api/>
        <nodes count="1"/>
    </container>
    <content id="default_content" version="1.0">
        <redundancy>1</redundancy>
        <documents>
            <!-- Define document types -->
        </documents>
        <nodes count="1"/>
    </content>
</services>
`;
    }
    defaultDeploymentXml() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<deployment version="1.0">
    <prod>
        <region active="true">default</region>
    </prod>
</deployment>
`;
    }
}
exports.ApplicationPackage = ApplicationPackage;
//# sourceMappingURL=application.js.map