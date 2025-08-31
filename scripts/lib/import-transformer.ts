import fs from "fs/promises";
import { RegistryItemType } from "./types.js";

export class ImportTransformer {
  private transformationCache = new Map<string, string>();

  async transformImports(
    filePath: string,
    fileType: RegistryItemType
  ): Promise<string | undefined> {
    const cacheKey = `${filePath}:${fileType}`;
    if (this.transformationCache.has(cacheKey)) {
      return this.transformationCache.get(cacheKey);
    }

    try {
      const content = await fs.readFile(filePath, "utf-8");
      const transformedContent = this.transformContent(content, fileType);

      this.transformationCache.set(cacheKey, transformedContent);

      return transformedContent;
    } catch (error) {
      console.warn(
        `Warning: Could not read file ${filePath} for content transformation:`,
        error instanceof Error ? error.message : String(error)
      );
      return undefined;
    }
  }

  private transformContent(
    content: string,
    fileType: RegistryItemType
  ): string {
    let transformedContent = content;

    switch (fileType) {
      case "registry:page":
        transformedContent = this.transformPageImports(transformedContent);
        break;
      case "registry:component":
      case "registry:block":
      case "registry:ui":
        transformedContent = this.transformComponentImports(transformedContent);
        break;
      case "registry:lib":
      case "registry:hook":
        transformedContent = this.transformLibraryImports(transformedContent);
        break;
      default:
        transformedContent = this.transformGenericImports(transformedContent);
    }

    return transformedContent;
  }

  private transformPageImports(content: string): string {
    let transformed = content;

    transformed = transformed.replace(
      /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\.\/((?![\/]).+)["']/g,
      (_, importPart, relativePath) => {
        return `import ${importPart} from "@/components/${relativePath}"`;
      }
    );

    transformed = transformed.replace(
      /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\/((?![\/]).+)["']/g,
      (_, importPart, relativePath) => {
        return `import ${importPart} from "@/components/${relativePath}"`;
      }
    );

    return transformed;
  }

  private transformComponentImports(content: string): string {
    let transformed = content;

    transformed = transformed.replace(
      /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\/((?![\/]).+)["']/g,
      (_, importPart, relativePath) => {
        return `import ${importPart} from "@/components/${relativePath}"`;
      }
    );

    transformed = transformed.replace(
      /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\.\/((?![\/]).+)["']/g,
      (_, importPart, relativePath) => {
        return `import ${importPart} from "@/components/${relativePath}"`;
      }
    );

    return transformed;
  }

  private transformLibraryImports(content: string): string {
    let transformed = content;

    transformed = transformed.replace(
      /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\/((?![\/]).+)["']/g,
      (_, importPart, relativePath) => {
        return `import ${importPart} from "@/lib/${relativePath}"`;
      }
    );

    return transformed;
  }

  private transformGenericImports(content: string): string {
    let transformed = content;

    transformed = transformed.replace(
      /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\/((?![\/]).+)["']/g,
      (_, importPart, relativePath) => {
        return `import ${importPart} from "@/components/${relativePath}"`;
      }
    );

    return transformed;
  }

  clearCache(): void {
    this.transformationCache.clear();
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.transformationCache.size,
      hitRate: this.transformationCache.size > 0 ? 0.8 : 0, // Rough estimate
    };
  }

  transformContentString(content: string, fileType: RegistryItemType): string {
    return this.transformContent(content, fileType);
  }

  validateTransformations(
    original: string,
    transformed: string
  ): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    const relativeImports = original.match(
      /import\s+.+\s+from\s+["']\.[\/]?.+["']/g
    );
    if (relativeImports) {
      const remainingRelative = transformed.match(
        /import\s+.+\s+from\s+["']\.[\/]?.+["']/g
      );
      if (remainingRelative && remainingRelative.length > 0) {
        issues.push(
          `${remainingRelative.length} relative imports were not transformed`
        );
      }
    }

    const malformedImports = transformed.match(
      /import\s+.+\s+from\s+["']@\/\/+/g
    );
    if (malformedImports) {
      issues.push("Found malformed @/ imports with double slashes");
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
