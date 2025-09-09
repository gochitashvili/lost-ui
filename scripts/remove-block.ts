#!/usr/bin/env bun
import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import { join } from "path";

interface RemoveBlockArgs {
  category: string;
  id: string;
}

function parseArgs(): RemoveBlockArgs {
  const args = process.argv.slice(2);
  const parsed: Partial<RemoveBlockArgs> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, "");
    const value = args[i + 1];

    if (key && value) {
      if (key === "category") parsed.category = value;
      if (key === "id") parsed.id = value;
    }
  }

  if (!parsed.category || !parsed.id) {
    console.error(
      "Usage: npx tsx scripts/remove-block.ts --category <category> --id <block-id>"
    );
    console.error("Examples:");
    console.error(
      "  npx tsx scripts/remove-block.ts --category navbars --id navbar-01"
    );
    console.error(
      "  npx tsx scripts/remove-block.ts --category forms --id contact-form"
    );
    process.exit(1);
  }

  return parsed as RemoveBlockArgs;
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

async function runGenerateMarkdown(): Promise<void> {
  return new Promise((resolve, reject) => {
    const { spawn } = require("child_process");
    console.log("Running bun run generate:markdown...");

    const child = spawn("bun", ["run", "generate:markdown"], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    child.on("close", (code: number) => {
      if (code === 0) {
        console.log("✓ Generated MDX documentation");
        resolve();
      } else {
        reject(new Error(`generate:markdown exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

async function main() {
  const args = parseArgs();

  console.log(`Removing block: ${args.id} from category: ${args.category}`);

  try {
    const componentName = toPascalCase(args.id);

    // 1. Check if block exists and determine type
    const fileBlockPath = join(
      process.cwd(),
      `components/lost-ui/${args.category}/${args.id}.tsx`
    );
    const directoryBlockPath = join(
      process.cwd(),
      `components/lost-ui/${args.category}/${args.id}`
    );

    let blockType: "file" | "directory" | null = null;
    let blockPath = "";

    if (existsSync(fileBlockPath)) {
      blockType = "file";
      blockPath = fileBlockPath;
    } else if (existsSync(directoryBlockPath)) {
      blockType = "directory";
      blockPath = directoryBlockPath;
    } else {
      console.error(
        `❌ Block "${args.id}" not found in category "${args.category}"`
      );
      console.error("Available blocks:");

      const categoryPath = join(
        process.cwd(),
        `components/lost-ui/${args.category}`
      );

      if (existsSync(categoryPath)) {
        const { readdirSync } = require("fs");
        const entries = readdirSync(categoryPath, { withFileTypes: true });
        entries.forEach((entry: any) => {
          if (
            entry.isFile() &&
            entry.name.endsWith(".tsx") &&
            entry.name !== "index.ts"
          ) {
            console.error(`  - ${entry.name.replace(".tsx", "")} (file)`);
          } else if (entry.isDirectory()) {
            console.error(`  - ${entry.name} (directory)`);
          }
        });
      }

      process.exit(1);
    }

    console.log(`Found ${blockType} block: ${args.id}`);

    // 2. Remove component files
    rmSync(blockPath, { recursive: true, force: true });
    console.log(`✓ Removed ${blockPath}`);

    // 3. Update blocks-metadata.ts
    const metadataPath = join(process.cwd(), "content/blocks-metadata.ts");
    let metadataContent = readFileSync(metadataPath, "utf8");

    // Remove the block entry
    const blockEntryRegex = new RegExp(
      `\\s*\\{[^}]*id:\\s*"${args.id}"[^}]*\\},?\\s*`,
      "g"
    );
    metadataContent = metadataContent.replace(blockEntryRegex, "");

    // Clean up any trailing commas before closing bracket
    metadataContent = metadataContent.replace(/,(\s*\]\s*;)/, "$1");

    writeFileSync(metadataPath, metadataContent);
    console.log("✓ Updated content/blocks-metadata.ts");

    // 4. Update blocks-components.tsx
    const componentsPath = join(process.cwd(), "content/blocks-components.tsx");
    let componentsContent = readFileSync(componentsPath, "utf8");

    // Remove the component entry
    const componentEntryRegex = new RegExp(
      `\\s*"${args.id}":\\s*components\\.${componentName},?\\s*`,
      "g"
    );
    componentsContent = componentsContent.replace(componentEntryRegex, "");

    // Clean up any trailing commas before closing brace
    componentsContent = componentsContent.replace(/,(\s*\}\s*;)/, "$1");

    writeFileSync(componentsPath, componentsContent);
    console.log("✓ Updated content/blocks-components.tsx");

    // 5. Update category index.ts
    const categoryIndexPath = join(
      process.cwd(),
      `components/lost-ui/${args.category}/index.ts`
    );

    if (existsSync(categoryIndexPath)) {
      let categoryIndexContent = readFileSync(categoryIndexPath, "utf8");

      // Remove the export entry
      const exportEntryRegex = new RegExp(
        `export\\s*\\{\\s*default\\s+as\\s+${componentName}\\s*\\}\\s*from\\s*"\\.\/${args.id}"\\s*;?\\s*`,
        "g"
      );
      categoryIndexContent = categoryIndexContent.replace(exportEntryRegex, "");

      writeFileSync(categoryIndexPath, categoryIndexContent);
      console.log(`✓ Updated components/lost-ui/${args.category}/index.ts`);
    }

    // 6. Generate markdown for cleanup
    await runGenerateMarkdown();

    console.log(`\n🎉 Successfully removed block "${args.id}"!`);
    console.log(`\nNext steps:`);
    console.log(
      `1. Run 'npx tsx scripts/generate-registry.ts' to update the registry`
    );
    console.log(`2. Verify the block is no longer available in the UI`);
  } catch (error) {
    console.error("Error removing block:", error);
    process.exit(1);
  }
}

main().catch(console.error);
