import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config";
import { blocksCategoriesMetadata } from "@/content/blocks-categories";

export const metadata: Metadata = {
  title: "Building Blocks for the Web",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Building Blocks for the Web",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "lost-ui.vercel.app",
    images: [siteConfig.ogImage],
  },
};

export default function Home() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-10">
      {blocksCategoriesMetadata.map((block) => (
        <Link href={`/${block.id}`} key={`${block.id}-${block.name}`}>
          <div className="space-y-3">
            <block.thumbnail className="border-border w-full rounded-lg border grayscale" />
            <div className="flex flex-col gap-1">
              <div className="text-base leading-none font-medium tracking-tight">
                {block.name}
              </div>
              <div className="text-muted-foreground text-sm">
                {block.count} blocks
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
