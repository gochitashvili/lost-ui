import { Block } from "@/components/ui/block";
import { CustomMDX } from "@/components/ui/mdx";
import { getBlocks } from "@/lib/blocks";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ blocksCategory: string }>;
};

export default async function Page({ params }: PageProps) {
  const { blocksCategory } = await params;
  const blocks = getBlocks({ blocksCategory });

  if (!blocks) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-2">
        <Link
          href="/"
          className="text-sm text-gray-500 flex gap-1 items-center"
        >
          <ArrowLeftIcon className="w-3 h-3" />
          <span>Back to blocks</span>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">{blocks.name}</h1>
      </div>

      <div className="mt-12 overflow-hidden px-px pb-px">
        {blocks.blocksData?.map((block) => (
          <Block
            key={block.name}
            name={block.name}
            codeSource={
              block.codeSource && (
                <CustomMDX source={block.codeSource.toString()} />
              )
            }
            blocksId={block.blocksId}
            blocksCategory={block.blocksCategory}
          />
        ))}
      </div>
    </div>
  );
}
