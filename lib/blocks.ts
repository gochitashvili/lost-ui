import { blocksCategoriesMetadata } from "@/content/blocks-categories";
import { blocksMetadata } from "@/content/blocks-metadata";
import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";
import { ReactNode } from "react";

type Metadata = {
  title: string;
  publishedAt?: string;
  summary?: string;
  image?: string;
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

export interface BlocksProps {
  name: string;
  code?: string | ReactNode;
  codeSource?: string | ReactNode;
  copyCode?: ReactNode;
  blocksId: string;
  blocksCategory: string;
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
        const codeSource = getBlocksMDX(block.category).find(
          (blocks) => blocks.blocksCategory === block.id
        )?.content;

        blocksData.push({
          codeSource,
          name: block.name,
          blocksId: block.id,
          blocksCategory: block.category,
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
