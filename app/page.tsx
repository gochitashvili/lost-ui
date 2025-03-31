import { blocksCategoriesMetadata } from "@/content/blocks-categories";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <div className="mb-15">
        <h1 className="text-foreground mb-4 text-4xl/[1.1] font-bold tracking-tight md:text-5xl/[1.1]">
          Building Blocks for the Web
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Clean, modern building blocks. Copy and paste into your apps. Works
          with all React frameworks. Open Source. Free forever.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-10 w-full">
        {blocksCategoriesMetadata.map((block) => (
          <Link
            key={`${block.id}-${block.name}`}
            href={`/${block.id}`}
            prefetch={true}
          >
            <div className="space-y-2">
              <block.thumbnail className="grayscale rounded-lg border border-border" />

              <div className="font-medium leading-none tracking-tight">
                {block.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
