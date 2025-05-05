import { Schema } from './schema';
/**
 * Represents a Vespa application package, containing configuration files like
 * schemas, services.xml, hosts.xml, etc.
 */
export declare class ApplicationPackage {
    readonly name: string;
    private files;
    /**
     * Creates an ApplicationPackage instance.
     *
     * @param name - The name of the application package.
     */
    constructor(name: string);
    /**
     * Adds a schema to the application package.
     *
     * @param schema - The Schema object to add.
     */
    addSchema(schema: Schema): void;
    /**
     * Adds or replaces a file within the application package structure.
     *
     * @param relativePath - The path relative to the application package root (e.g., "services.xml", "schemas/my_schema.sd", "components/my_component.jar").
     * @param content - The content of the file (string or Buffer).
     */
    addFile(relativePath: string, content: string | Buffer): void;
    /**
     * Adds a directory and its contents recursively to the application package.
     * Files will be placed relative to the specified destination directory within the package.
     *
     * @param sourceDir - The absolute path to the local directory to add.
     * @param destinationDir - The relative path within the application package where the directory contents should be placed (e.g., "components", "search/query-profiles"). Defaults to the root.
     */
    addDirectory(sourceDir: string, destinationDir?: string): void;
    /**
     * Retrieves the content of a specific file within the package.
     *
     * @param relativePath - The relative path of the file.
     * @returns The file content (string or Buffer), or undefined if not found.
     */
    getFileContent(relativePath: string): string | Buffer | undefined;
    /**
     * Gets a map of all schemas currently in the package.
     * Assumes schemas are stored under a "schemas/" directory with ".sd" extension.
     *
     * @returns A map where keys are schema names and values are Schema objects.
     */
    get schemas(): Map<string, Schema>;
    /**
     * Generates the application package as a zipped Buffer, ready for deployment.
     *
     * @returns A promise resolving to a Buffer containing the zipped application package.
     */
    toZipBuffer(): Promise<Buffer>;
    /**
     * Generates the application package as a zip file saved to the filesystem.
     *
     * @param targetPath - Optional path to save the zip file. Defaults to a temporary file.
     * @returns A promise resolving to the path where the zip file was saved.
     */
    toZipFile(targetPath?: string): Promise<string>;
    private defaultServicesXml;
    private defaultDeploymentXml;
}
