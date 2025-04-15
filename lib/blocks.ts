import { blocksCategoriesMetadata } from "@/content/blocks-categories";
import { blocksMetadata } from "@/content/blocks-metadata";
import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";
import { ReactNode } from "react";

// --- Added File Tree Types ---
type FileItem = {
  name: string;
  path: string;
  content?: string;
  type: "file";
};

type FolderItem = {
  name: string;
  path: string;
  type: "folder";
  children: FileTreeItem[];
};

type FileTreeItem = FileItem | FolderItem;
// --- End Added File Tree Types ---

type Metadata = {
  title: string;
  publishedAt?: string;
  summary?: string;
  image?: string;
  blocksCategory: string;
  meta?: {
    iframeHeight?: string;
    type?: "file" | "directory";
  };
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    return {
      metadata: {},
      content: fileContent.trim(),
    };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    metadata[key.trim() as keyof Metadata] = value;
  });

  return {
    metadata: metadata as Metadata,
    content,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const blocksCategory = path.basename(file, path.extname(file));
    return {
      metadata,
      blocksCategory,
      content,
    };
  });
}

export function getBlocksMDX(blocksCategory: string) {
  return getMDXData(
    path.join(process.cwd(), "content", "markdown", blocksCategory)
  );
}

// --- Added Directory Reading Function ---
function readDirectoryTree(dirPath: string, basePath = ""): FileTreeItem[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const tree: FileTreeItem[] = [];

    for (const entry of entries) {
      const currentPath = path.join(dirPath, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        tree.push({
          name: entry.name,
          path: relativePath,
          type: "folder",
          children: readDirectoryTree(currentPath, relativePath),
        });
      } else if (entry.isFile()) {
        // Optional: Add filters for allowed file types if needed
        // e.g., if (![\"tsx\", \"ts\", \"css\", \"js\", \"jsx\"].includes(path.extname(entry.name).substring(1))) continue;
        try {
          const content = fs.readFileSync(currentPath, "utf-8");
          tree.push({
            name: entry.name,
            path: relativePath,
            type: "file",
            content: content,
          });
        } catch (readErr) {
          console.error(`Error reading file ${currentPath}:`, readErr);
          // Optionally add file item even if content fails to read
          tree.push({
            name: entry.name,
            path: relativePath,
            type: "file",
            content: `// Error reading file content`,
          });
        }
      }
    }
    return tree;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return []; // Return empty array on error
  }
}
// --- End Added Directory Reading Function ---

export interface BlocksProps {
  name: string;
  code?: string | ReactNode;
  codeSource?: string | ReactNode;
  copyCode?: ReactNode;
  blocksId: string;
  blocksCategory: string;
  meta?: {
    iframeHeight?: string;
    type?: "file" | "directory";
  };
  fileTree?: FileTreeItem[];
}

export function getBlocks(params: { blocksCategory: string }) {
  const categoryMetadata = blocksCategoriesMetadata.find(
    (metadata) => metadata.id === params.blocksCategory
  );

  const blocksData: BlocksProps[] = [];
  blocksMetadata
    .filter((blocks) => blocks.category === params.blocksCategory)
    .forEach((block) => {
      try {
        let codeSource: string | ReactNode | undefined = undefined;
        let fileTree: FileTreeItem[] | undefined = undefined;

        if (block.type === "directory") {
          const blockDirPath = path.join(
            process.cwd(),
            "content",
            "components", // Assuming components live here
            block.id
          );
          fileTree = readDirectoryTree(blockDirPath);
          // For directory type, codeSource might be irrelevant or could point to a main file
          // codeSource = findMainFileContent(fileTree); // Optional: logic to find main file
        } else {
          // Existing logic for file type
          codeSource = getBlocksMDX(block.category).find(
            (blocks) => blocks.blocksCategory === block.id
          )?.content;
        }

        blocksData.push({
          codeSource,
          name: block.name,
          blocksId: block.id,
          meta: {
            iframeHeight: block.iframeHeight,
            type: block.type,
          },
          blocksCategory: block.category,
          fileTree,
        });
      } catch (err) {
        console.error(err);
      }
    });

  if (categoryMetadata) {
    return {
      name: categoryMetadata.name,
      blocksData: blocksData,
    };
  }

  return notFound();
}
