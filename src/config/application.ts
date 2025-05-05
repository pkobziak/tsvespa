// src/config/application.ts
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import archiver from 'archiver';
import { Schema } from './schema';
import { VespaConfigurationError } from '../utils/errors';

// Define interfaces for structured configuration elements if needed
// For now, using strings for simplicity, similar to early pyvespa
interface VespaFile {
    path: string; // Relative path within the application package (e.g., "schemas/myschema.sd")
    content: string | Buffer;
}

/**
 * Represents a Vespa application package, containing configuration files like
 * schemas, services.xml, hosts.xml, etc.
 */
export class ApplicationPackage {
    public readonly name: string;
    private files: Map<string, VespaFile> = new Map();

    /**
     * Creates an ApplicationPackage instance.
     *
     * @param name - The name of the application package.
     */
    constructor(name: string) {
        if (!name) {
            throw new VespaConfigurationError("ApplicationPackage name cannot be empty.");
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
    addSchema(schema: Schema): void {
        this.addFile(path.join("schemas", `${schema.name}.sd`), schema.content);
    }

    /**
     * Adds or replaces a file within the application package structure.
     *
     * @param relativePath - The path relative to the application package root (e.g., "services.xml", "schemas/my_schema.sd", "components/my_component.jar").
     * @param content - The content of the file (string or Buffer).
     */
    addFile(relativePath: string, content: string | Buffer): void {
        const normalizedPath = path.normalize(relativePath).replace(/^\.\.?\//, ""); // Basic normalization
        if (normalizedPath.startsWith("/") || normalizedPath.includes("..")) {
            throw new VespaConfigurationError(`Invalid relative path: ${relativePath}`);
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
    addDirectory(sourceDir: string, destinationDir: string = "."): void {
        if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
            throw new VespaConfigurationError(`Source directory does not exist or is not a directory: ${sourceDir}`);
        }

        const normalizedDest = path.normalize(destinationDir).replace(/^\.\.?\//, "");
        if (normalizedDest.startsWith("/") || normalizedDest.includes("..")) {
            throw new VespaConfigurationError(`Invalid relative destination directory: ${destinationDir}`);
        }

        const files = fs.readdirSync(sourceDir, { withFileTypes: true });
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file.name);
            const relativeDestPath = path.join(normalizedDest, file.name);
            if (file.isDirectory()) {
                this.addDirectory(sourcePath, relativeDestPath); // Recurse
            } else if (file.isFile()) {
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
    getFileContent(relativePath: string): string | Buffer | undefined {
        const normalizedPath = path.normalize(relativePath).replace(/^\.\.?\//, "");
        return this.files.get(normalizedPath)?.content;
    }

    /**
     * Gets a map of all schemas currently in the package.
     * Assumes schemas are stored under a "schemas/" directory with ".sd" extension.
     *
     * @returns A map where keys are schema names and values are Schema objects.
     */
    get schemas(): Map<string, Schema> {
        const schemaMap = new Map<string, Schema>();
        for (const [filePath, fileData] of this.files.entries()) {
            if (filePath.startsWith("schemas/") && filePath.endsWith(".sd")) {
                const schemaName = path.basename(filePath, ".sd");
                if (typeof fileData.content === "string") {
                    schemaMap.set(schemaName, new Schema(schemaName, fileData.content));
                } else {
                    // Handle buffer content if necessary, maybe decode?
                    console.warn(`Schema file ${filePath} has Buffer content, attempting to decode as UTF-8.`);
                    try {
                        const contentStr = fileData.content.toString("utf-8");
                        schemaMap.set(schemaName, new Schema(schemaName, contentStr));
                    } catch (e) {
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
    async toZipBuffer(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const archive = archiver("zip", {
                zlib: { level: 9 } // Maximum compression
            });

            const buffers: Buffer[] = [];
            archive.on("data", (data) => buffers.push(data));
            archive.on("warning", (err) => console.warn("Archiver warning:", err));
            archive.on("error", (err) => reject(new VespaConfigurationError(`Failed to create zip archive: ${err.message}`)));
            archive.on("end", () => resolve(Buffer.concat(buffers)));

            // Add all files to the archive
            for (const file of this.files.values()) {
                archive.append(file.content, { name: file.path });
            }

            archive.finalize();
        });
    }

    /**
     * Generates the application package as a zip file saved to the filesystem.
     *
     * @param targetPath - Optional path to save the zip file. Defaults to a temporary file.
     * @returns A promise resolving to the path where the zip file was saved.
     */
    async toZipFile(targetPath?: string): Promise<string> {
        const outputPath = targetPath || path.join(os.tmpdir(), `${this.name}-${Date.now()}.zip`);
        const output = fs.createWriteStream(outputPath);
        const archive = archiver("zip", {
            zlib: { level: 9 }
        });

        return new Promise((resolve, reject) => {
            output.on("close", () => resolve(outputPath));
            // output.on("end", () => console.log("Data has been drained")); // For debugging
            archive.on("warning", (err) => console.warn("Archiver warning:", err));
            archive.on("error", (err) => reject(new VespaConfigurationError(`Failed to write zip file: ${err.message}`)));

            archive.pipe(output);

            for (const file of this.files.values()) {
                archive.append(file.content, { name: file.path });
            }

            archive.finalize();
        });
    }

    // --- Default file contents (similar to pyvespa) ---

    private defaultServicesXml(): string {
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

    private defaultDeploymentXml(): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<deployment version="1.0">
    <prod>
        <region active="true">default</region>
    </prod>
</deployment>
`;
    }
}

