// src/config/schema.ts

/**
 * Represents a Vespa schema definition.
 * For now, it primarily holds the schema content as a string.
 * Could be expanded to a structured object representation later.
 */
export class Schema {
    public readonly name: string;
    public readonly content: string;

    /**
     * Creates a Schema instance.
     *
     * @param name - The name of the schema (e.g., "product").
     * @param content - The full content of the .sd file as a string.
     */
    constructor(name: string, content: string) {
        if (!name) {
            throw new Error("Schema name cannot be empty.");
        }
        if (!content) {
            throw new Error("Schema content cannot be empty.");
        }
        this.name = name;
        this.content = content;
    }
}

