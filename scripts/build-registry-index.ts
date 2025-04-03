/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

const baseDir = path.resolve(__dirname, "..", "content");
const componentsDir = path.join(baseDir, "components");
const publicDir = path.resolve(__dirname, "..", "public");

type RegistryType = "registry:block";

interface RegistryFile {
  path: string;
  type: RegistryType;
}

interface RegistryItem {
  name: string;
  type: RegistryType;
  files: RegistryFile[];
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  author?: string;
  component?: string; // This will be a string representation of React.lazy
}

interface AdditionalConfig {
  dependencies?: string[];
  devDependencies?: string[];
}

function extractDependencies(sourceCode: string): {
  componentDeps: Set<string>;
  utilDeps: Set<string>;
  externalDeps: Set<string>;
} {
  const componentDeps = new Set<string>();
  const utilDeps = new Set<string>();
  const externalDeps = new Set<string>();

  const componentImportRegex =
    /import\s+.*?from\s+['"]@\/components\/([^'"]+)['"]/g;
  const dynamicImportRegex =
    /dynamic\(\s*\(\)\s*=>\s*import\(\s*['"]@\/components\/([^'"]+)['"]\s*\)/g;
  const utilImportRegex = /import\s+.*?from\s+['"]@\/utils\/([^'"]+)['"]/g;
  const externalImportRegex = /from\s+['"]([^'"@\./][^'"]+)['"]/g;

  let match;

  while ((match = componentImportRegex.exec(sourceCode)) !== null) {
    componentDeps.add(`components/${match[1].replace(/\.(ts|tsx)$/, "")}`);
  }

  while ((match = dynamicImportRegex.exec(sourceCode)) !== null) {
    componentDeps.add(`components/${match[1].replace(/\.(ts|tsx)$/, "")}`);
  }

  while ((match = utilImportRegex.exec(sourceCode)) !== null) {
    utilDeps.add(`utils/${match[1].replace(/\.(ts|tsx)$/, "")}`);
  }

  while ((match = externalImportRegex.exec(sourceCode)) !== null) {
    const importPath = match[1];
    const packageName = importPath.split("/")[0];
    if (!packageName.startsWith("react") && !packageName.startsWith("next")) {
      externalDeps.add(packageName);
    }
  }

  return { componentDeps, utilDeps, externalDeps };
}

function normalizeComponentName(filePath: string): string {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

function getSimplifiedPath(filePath: string): string {
  const relativePath = path
    .relative(componentsDir, filePath)
    .replace(/\\/g, "/");
  return relativePath.replace(/\.(ts|tsx)$/, "");
}

function readAdditionalConfig(filePath: string): AdditionalConfig | null {
  const configPath = filePath.replace(/\.(ts|tsx)$/, ".json");
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
      console.warn(`Error reading config ${configPath}:`, error);
    }
  }
  return null;
}

function generateRegistryItem(filePath: string): RegistryItem | null {
  const sourceCode = fs.readFileSync(filePath, "utf-8");
  const name = normalizeComponentName(filePath);
  const simplifiedPath = getSimplifiedPath(filePath);
  const currentRegistryPath = `components/${simplifiedPath}`;

  const { componentDeps, utilDeps, externalDeps } =
    extractDependencies(sourceCode);
  const config = readAdditionalConfig(filePath);

  const registryDependencies = [...componentDeps, ...utilDeps].filter(
    (dep) => dep !== currentRegistryPath
  );

  const allExternalDeps = new Set([
    ...externalDeps,
    ...(config?.dependencies || []),
  ]);

  const files: RegistryFile[] = [
    {
      path: simplifiedPath,
      type: "registry:block",
    },
  ];

  const item: RegistryItem = {
    name,
    type: "registry:block",
    files,
    author: "ephraim duncan <https://ephraimduncan.com>",
  };

  if (registryDependencies.length > 0) {
    item.registryDependencies = registryDependencies;
  }

  if (allExternalDeps.size > 0) {
    item.dependencies = Array.from(allExternalDeps);
  }

  if (config?.devDependencies?.length) {
    item.devDependencies = config.devDependencies;
  }

  const importPath = `@/content/${currentRegistryPath}`;
  item.component = `React.lazy(() => import('${importPath}'))`;

  return item;
}

function traverseDirectory(dir: string): Record<string, RegistryItem> {
  const registry: Record<string, RegistryItem> = {};

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.name.match(/^index\.(ts|tsx)$/)) {
      continue;
    }

    if (entry.isDirectory()) {
      Object.assign(registry, traverseDirectory(fullPath));
    } else if (entry.isFile() && entry.name.match(/\.(tsx|ts)$/)) {
      const item = generateRegistryItem(fullPath);
      if (item) {
        registry[item.name] = item;
      }
    }
  }

  return registry;
}

function writeRegistryFiles(registry: Record<string, RegistryItem>) {
  const registryWithLazyComponents = { ...registry };

  const tsContent = `import * as React from "react";

const componentRegistry = ${JSON.stringify(
    registryWithLazyComponents,
    null,
    2
  )};

export const registry = componentRegistry;
`;

  const formattedTsContent = tsContent
    .replace(/"component": "(React\.lazy\(.+?\))"/g, "component: $1")
    .replace(/\\'/g, "'");

  fs.writeFileSync(path.join(baseDir, "index.ts"), formattedTsContent);

  const cleanRegistry: Record<string, Omit<RegistryItem, "component">> = {};
  for (const key in registry) {
    const { component, ...rest } = registry[key];
    cleanRegistry[key] = rest;
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(publicDir, "index.json"),
    JSON.stringify(cleanRegistry, null, 2)
  );

  console.log("Registry files generated successfully!");
}

// --- Main Execution ---
const componentRegistry = traverseDirectory(componentsDir);
writeRegistryFiles(componentRegistry);
