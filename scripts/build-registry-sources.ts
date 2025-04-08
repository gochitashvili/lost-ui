import fs from "fs";
import path from "path";
import { registryItemSchema } from "shadcn/registry";

const baseDir = path.resolve(__dirname, "..");
const registryJsonPath = path.resolve(baseDir, "public", "index.json");
const registrySourcesDir = path.resolve(baseDir, "public", "r");
const contentComponentsDir = path.resolve(baseDir, "content", "components");

type RegistryType = "registry:block";

interface InputRegistryFile {
  path: string; // e.g., "category/component-name"
  type: RegistryType;
}

interface InputRegistryItem {
  name: string;
  type: RegistryType;
  files: InputRegistryFile[];
  registryDependencies?: string[]; // e.g., ["components/ui/button", "utils/cn"]
  dependencies?: string[];
  devDependencies?: string[];
  author?: string;
}

interface ProcessedFile {
  path: string; // e.g., "/components/category/component-name.tsx"
  content: string;
  type: RegistryType;
  target: string; // e.g., "/components/category/component-name.tsx"
}

interface OutputRegistryItem {
  $schema: string;
  name: string;
  type: RegistryType;
  dependencies: string[];
  registryDependencies?: string[]; // e.g., ["button", "cn"]
  devDependencies?: string[];
  files: ProcessedFile[];
  author?: string;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File does not exist: ${filePath}`);
      return null;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading or parsing JSON file ${filePath}:`, error);
    return null;
  }
}

function getSourceContent(filePath: string): string {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Source file does not exist: ${filePath}`);
      return "";
    }
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return "";
  }
}

function processItemFiles(item: InputRegistryItem): ProcessedFile[] {
  return item.files
    .map((file): ProcessedFile | null => {
      const sourceFilePath = path.resolve(
        contentComponentsDir,
        `${file.path}.tsx`
      );
      const content = getSourceContent(sourceFilePath);

      if (!content) {
        return null;
      }

      return {
        path: `/components/${file.path}.tsx`,
        content,
        type: file.type,
        target: `/components/blocks/${file.path.split("/").pop()}.tsx`,
      };
    })
    .filter((file): file is ProcessedFile => file !== null);
}

function parseRegistryDependencyName(depPath: string): string | null {
  // Handles "components/ui/button" -> "button", "utils/cn" -> "cn", "components/block/name" -> "name"
  const parts = depPath.split("/");
  return parts.pop() || null;
}

function parseImports(content: string): string[] {
  const regex = /from\s+['"]([^'"]+)['"]/g;
  const imports = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  return Array.from(imports);
}

function processRegistryItem(
  name: string,
  item: InputRegistryItem,
  registry: Record<string, InputRegistryItem>
): OutputRegistryItem {
  const processedFiles = processItemFiles(item);
  const registryDeps = new Set<string>();

  // Add explicitly listed registryDependencies
  (item.registryDependencies || []).forEach((depPath) => {
    const depName = parseRegistryDependencyName(depPath);
    if (depName && depName !== name) {
      registryDeps.add(depName);
    }
  });

  // Parse imports from file content to find potential implicit dependencies
  processedFiles.forEach((file) => {
    const imports = parseImports(file.content);
    imports.forEach((importPath) => {
      // Handle shadcn/ui components
      if (importPath.startsWith("@/components/ui/")) {
        const componentName = importPath.split("/").pop();
        if (componentName && componentName !== name) {
          registryDeps.add(componentName);
        }
      }

      // Check if import path maps to another registry item
      const possibleDepName = importPath.split("/").pop();
      if (
        possibleDepName &&
        registry[possibleDepName] &&
        possibleDepName !== name
      ) {
        registryDeps.add(possibleDepName);
      }
    });
  });

  const output: OutputRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: item.type,
    dependencies: item.dependencies || [],
    files: processedFiles,
    author: item.author,
  };

  if (registryDeps.size > 0) {
    output.registryDependencies = Array.from(registryDeps).sort();
  }

  if (item.devDependencies?.length) {
    output.devDependencies = item.devDependencies;
  }

  return output;
}

function buildSourceFiles() {
  const registry =
    readJsonFile<Record<string, InputRegistryItem>>(registryJsonPath);

  if (!registry) {
    console.error("Failed to load registry JSON. Aborting.");
    return;
  }

  if (!fs.existsSync(registrySourcesDir)) {
    fs.mkdirSync(registrySourcesDir, { recursive: true });
  }

  let count = 0;
  Object.entries(registry).forEach(([name, item]) => {
    if (item.type === "registry:block") {
      const sourceFile = processRegistryItem(name, item, registry);
      const outputPath = path.join(registrySourcesDir, `${name}.json`);
      try {
        const parsed = registryItemSchema.parse(sourceFile);

        fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2));
        console.log(`Generated source file for: ${name}`);
        count++;
      } catch (error) {
        console.error(`Failed to write source file for ${name}:`, error);
      }
    }
  });

  console.log(`Source files generation completed. Generated ${count} files.`);
}

buildSourceFiles();
