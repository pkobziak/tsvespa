"use strict";
// src/config/schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
/**
 * Represents a Vespa schema definition.
 * For now, it primarily holds the schema content as a string.
 * Could be expanded to a structured object representation later.
 */
class Schema {
    /**
     * Creates a Schema instance.
     *
     * @param name - The name of the schema (e.g., "product").
     * @param content - The full content of the .sd file as a string.
     */
    constructor(name, content) {
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
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map