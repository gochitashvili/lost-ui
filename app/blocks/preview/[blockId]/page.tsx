import { blocksComponents } from "@/content/blocks-components";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{
    blockId: string;
  }>;
};

export async function generateStaticParams() {
  const blockIds = Object.keys(blocksComponents);

  return blockIds.map((blockId) => ({
    blockId: blockId,
  }));
}

export default async function BlockPreviewPage({ params }: Params) {
  const { blockId } = await params;
  const BlocksComponent = blocksComponents[blockId];

  if (!BlocksComponent) {
    notFound();
  }

  return (
    <div className="flex w-full items-center justify-center">
      <BlocksComponent />
    </div>
  );
}
