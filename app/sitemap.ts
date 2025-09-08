import type { MetadataRoute } from "next";

import { blocksCategoriesMetadata } from "@/content/blocks-categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: "https://lost-ui.vercel.app",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  const blocksPages = blocksCategoriesMetadata.map((category) => ({
    url: `https://lost-ui.vercel.app/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [home, ...blocksPages];
}
