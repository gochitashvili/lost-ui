import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { existsSync } from "fs";
import { join } from "path";

import { blocksComponents } from "@/content/blocks-components";
import { blocksMetadata } from "@/content/blocks-metadata";
import { generateFileTree } from "@/lib/blocks";
import { CodeBlockEditor } from "@/components/code-block-editor";
import PreviewThemeSwitcher from "./theme-switcher";

type Params = {
  params: Promise<{
    blockId: string;
  }>;
};

export function generateStaticParams() {
  const blockIds = Object.keys(blocksComponents);

  return blockIds.map((blockId) => ({
    blockId,
  }));
}

export default async function BlockPreviewPage({ params }: Params) {
  const { blockId } = await params;

  // Find the block metadata to check if it's a directory type
  const blockMetadata = blocksMetadata.find((block) => block.id === blockId);

  // Check if this is a directory type block with an app/page.tsx file
  if (blockMetadata?.type === "directory") {
    const pagePath = join(
      process.cwd(),
      "content/components",
      blockMetadata.category,
      blockId,
      "app/page.tsx"
    );

    // If app/page.tsx exists, dynamically import and render it
    if (existsSync(pagePath)) {
      try {
        console.log(
          `Importing page component from: @/content/components/${blockMetadata.category}/${blockId}/app/page`
        );
        const PageComponent = (
          await import(
            `@/content/components/${blockMetadata.category}/${blockId}/app/page`
          )
        ).default;

        // Generate fileTree for the directory
        const blockDirPath = join(
          process.cwd(),
          "content/components",
          blockMetadata.category,
          blockId
        );
        const fileTree = generateFileTree(blockDirPath);

        return (
          <div className="relative w-full">
            <PageComponent />
            <PreviewThemeSwitcher />
          </div>
        );
      } catch (error) {
        console.error(`Failed to import page component for ${blockId}:`, error);
        // Fall back to regular component rendering
      }
    }
  }

  // Default behavior: render the component
  const BlocksComponent = blocksComponents[blockId];

  if (!BlocksComponent) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen w-full justify-center">
      <BlocksComponent />
      <PreviewThemeSwitcher />
    </div>
  );
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "lost-ui.vercel.app — Preview",
};
