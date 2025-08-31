import fs from "fs/promises";
import path from "path";
import { Project } from "ts-morph";

const COMPONENTS_DIR = "content/components";
const METADATA_FILE = "content/blocks-metadata.ts";
const OUTPUT_FILE = "registry.json";
const INDIVIDUAL_OUTPUT_DIR = "public/r";
const AUTHOR = "ephraim duncan <https://ephraimduncan.com>";
const SCHEMA = "https://ui.shadcn.com/schema/registry.json";
const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";
const HOMEPAGE = "https://blocks.so";
const NAME = "blocks";

function formatTitle(filename) {
  return filename
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function transformImports(filePath, fileType) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    
    let transformedContent = content;
    
    // Transform relative imports for app files
    if (fileType === "registry:page") {
      // Transform ../filename to @/components/filename
      transformedContent = transformedContent.replace(
        /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\.\/([^"']+)["']/g,
        (_, importPart, relativePath) => {
          return `import ${importPart} from "@/components/${relativePath}"`;
        }
      );
    }
    
    // For all files, transform ./ imports to @/components/ imports
    // This handles imports like "./mail-context" -> "@/components/mail-context"
    transformedContent = transformedContent.replace(
      /import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+["']\.\/([^"']+)["']/g,
      (_, importPart, relativePath) => {
        // Transform ./filename to @/components/filename
        return `import ${importPart} from "@/components/${relativePath}"`;
      }
    );
    
    return transformedContent;
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath} for content transformation:`, error.message);
    return undefined;
  }
}

async function loadMetadata() {
  try {
    const metadataModule = await import(path.resolve(METADATA_FILE));
    const blocksMetadata = metadataModule.blocksMetadata;

    if (!Array.isArray(blocksMetadata)) {
      console.error(
        `Error: Expected blocksMetadata to be an array in ${METADATA_FILE}`
      );
      process.exit(1);
    }

    const metadataMap = new Map();
    for (const item of blocksMetadata) {
      if (item.id && item.name) {
        metadataMap.set(item.id, item.name);
      } else {
        console.warn(
          `Warning: Invalid metadata entry found in ${METADATA_FILE}:`,
          item
        );
      }
    }
    return metadataMap;
  } catch (error) {
    console.error(
      `Error loading or parsing metadata file ${METADATA_FILE}:`,
      error
    );
    console.error(
      "Ensure you are running this script in an environment that can handle TypeScript imports (e.g., using 'tsx scripts/generate-registry.mjs')."
    );
    process.exit(1);
  }
}

function extractDependencies(project, filePath) {
  const registryDeps = new Set();
  const externalDeps = new Set();

  try {
    const sourceFile = project.addSourceFileAtPath(filePath);

    sourceFile.getImportDeclarations().forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      if (moduleSpecifier.startsWith("@/components/ui/")) {
        const componentName = moduleSpecifier.split("/").pop();
        if (componentName) {
          registryDeps.add(`@shadcn/${componentName}`);
        }
      } else if (
        !moduleSpecifier.startsWith(".") &&
        !moduleSpecifier.startsWith("@/") &&
        !moduleSpecifier.startsWith("react") &&
        !moduleSpecifier.startsWith("next") &&
        !moduleSpecifier.startsWith("@next/")
      ) {
        externalDeps.add(moduleSpecifier);
      }
    });
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
  }

  return {
    registryDependencies: [...registryDeps].sort(),
    dependencies: [...externalDeps].sort(),
  };
}

async function findTsxFiles(dirPath, baseSourceDir, baseTargetDir) {
  const files = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(baseSourceDir, fullPath);
    const sourcePathRelative = path
      .join(
        COMPONENTS_DIR,
        path.relative(path.resolve(process.cwd(), COMPONENTS_DIR), fullPath)
      )
      .replace(/\\/g, "/");

    if (entry.isDirectory()) {
      files.push(
        ...(await findTsxFiles(fullPath, baseSourceDir, baseTargetDir))
      );
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
    ) {
      let targetPath, fileType;

      const pathParts = relativePath.split(path.sep);
      const specialDirs = ["app", "lib", "hooks"];
      const specialDirIndex = pathParts.findIndex((part) =>
        specialDirs.includes(part)
      );

      if (specialDirIndex !== -1) {
        const specialDir = pathParts[specialDirIndex];
        const pathAfterSpecialDir = pathParts
          .slice(specialDirIndex + 1)
          .join("/");

        switch (specialDir) {
          case "app":
            targetPath = path
              .join("app", pathAfterSpecialDir)
              .replace(/\\/g, "/");
            fileType = "registry:page";
            break;
          case "lib":
            targetPath = path
              .join("lib", pathAfterSpecialDir)
              .replace(/\\/g, "/");
            fileType = "registry:lib";
            break;
          case "hooks":
            targetPath = path
              .join("hooks", pathAfterSpecialDir)
              .replace(/\\/g, "/");
            fileType = "registry:hook";
            break;
          default:
            targetPath = path
              .join(baseTargetDir, relativePath)
              .replace(/\\/g, "/");
            fileType = "registry:block";
        }
      } else {
        targetPath = path.join(baseTargetDir, relativePath).replace(/\\/g, "/");
        fileType = "registry:component";
      }

      // Transform content if needed (for app files)
      const transformedContent = await transformImports(fullPath, fileType);
      
      const fileInfo = {
        path: sourcePathRelative,
        absolutePath: fullPath,
        target: targetPath,
        type: fileType,
      };
      
      if (transformedContent) {
        fileInfo.content = transformedContent;
      }
      
      files.push(fileInfo);
    }
  }
  return files;
}

async function generateRegistry() {
  const metadataMap = await loadMetadata();
  const project = new Project();
  const registryItems = [];
  const absoluteComponentsDir = path.resolve(process.cwd(), COMPONENTS_DIR);

  try {
    const categories = await fs.readdir(absoluteComponentsDir, {
      withFileTypes: true,
    });

    for (const categoryDirent of categories) {
      if (categoryDirent.isDirectory()) {
        const category = categoryDirent.name;
        if (category.startsWith(".")) {
          continue;
        }
        const categoryPath = path.join(absoluteComponentsDir, category);
        const entries = await fs.readdir(categoryPath, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.name.startsWith(".") || entry.name.startsWith("index.")) {
            continue;
          }

          const blockId = entry.isDirectory()
            ? entry.name
            : path.basename(entry.name, ".tsx");
          const entryPath = path.join(categoryPath, entry.name);

          let title = metadataMap.get(blockId);
          if (!title) {
            console.warn(
              `Warning: Metadata not found for block ID "${blockId}". Using generated title.`
            );
            title = formatTitle(blockId);
          }
          const description = `A ${title.toLowerCase()} block.`;

          const allRegistryDeps = new Set();
          const allExternalDeps = new Set();
          const blockFiles = [];

          if (
            entry.isFile() &&
            (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
          ) {
            // Single-file block
            const absoluteFilePath = entryPath;
            const filePathRelative = path
              .join(COMPONENTS_DIR, category, entry.name)
              .replace(/\\/g, "/");
            const targetPath = path
              .join("components", entry.name)
              .replace(/\\/g, "/");

            const { registryDependencies, dependencies } = extractDependencies(
              project,
              absoluteFilePath
            );
            registryDependencies.forEach((dep) => allRegistryDeps.add(dep));
            dependencies.forEach((dep) => allExternalDeps.add(dep));

            // Get content for single-file blocks
            const transformedContent = await transformImports(absoluteFilePath, "registry:component");

            const blockFile = {
              path: filePathRelative,
              type: "registry:component",
              target: targetPath,
            };

            if (transformedContent) {
              blockFile.content = transformedContent;
            }

            blockFiles.push(blockFile);
          } else if (entry.isDirectory()) {
            const blockSourceDir = entryPath;
            const blockTargetDir = "components";

            const foundFiles = await findTsxFiles(
              blockSourceDir,
              blockSourceDir,
              blockTargetDir
            );

            for (const fileInfo of foundFiles) {
              const { registryDependencies, dependencies } =
                extractDependencies(project, fileInfo.absolutePath);
              registryDependencies.forEach((dep) => allRegistryDeps.add(dep));
              dependencies.forEach((dep) => allExternalDeps.add(dep));

              const blockFile = {
                path: fileInfo.path,
                type: fileInfo.type,
                target: fileInfo.target,
              };
              
              // Add content if it was transformed
              if (fileInfo.content) {
                blockFile.content = fileInfo.content;
              }
              
              blockFiles.push(blockFile);
            }
          } else {
            continue;
          }

          if (blockFiles.length > 0) {
            registryItems.push({
              name: blockId,
              type: "registry:block",
              title: title,
              description: description,
              author: AUTHOR,
              registryDependencies: [...allRegistryDeps].sort(),
              dependencies: [...allExternalDeps].sort(),
              files: blockFiles,
            });
          }
        }
      }
    }

    const registry = {
      $schema: SCHEMA,
      name: NAME,
      homepage: HOMEPAGE,
      items: registryItems.sort((a, b) => a.name.localeCompare(b.name)),
    };

    // Write main registry file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(registry, null, 2));
    
    // Create individual registry files
    try {
      await fs.mkdir(INDIVIDUAL_OUTPUT_DIR, { recursive: true });
    } catch (error) {
      // Directory already exists, ignore
    }

    for (const item of registryItems) {
      const individualItem = {
        $schema: ITEM_SCHEMA,
        ...item,
      };
      const filename = `${item.name}.json`;
      const filepath = path.join(INDIVIDUAL_OUTPUT_DIR, filename);
      await fs.writeFile(filepath, JSON.stringify(individualItem, null, 2));
    }

    console.log(
      `Successfully generated ${OUTPUT_FILE} with ${registryItems.length} items.`
    );
    console.log(
      `Generated ${registryItems.length} individual registry files in ${INDIVIDUAL_OUTPUT_DIR}/`
    );
  } catch (error) {
    console.error("Error generating registry:", error);
    process.exit(1);
  }
}

generateRegistry();
