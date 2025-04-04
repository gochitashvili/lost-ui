import { blocksComponents } from "@/content/blocks-components";
import { notFound } from "next/navigation";

interface BlockPreviewPageProps {
  params: {
    blockId: string;
  };
}

export default function BlockPreviewPage({ params }: BlockPreviewPageProps) {
  const { blockId } = params;
  const BlocksComponent = blocksComponents[blockId];

  if (!BlocksComponent) {
    notFound();
  }

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4">
      <BlocksComponent />
    </div>
  );
}
