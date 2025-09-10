import { blocksMetadata } from "./blocks-metadata";
import {
  BlocksCategoryMetadata,
  BlocksMetadata,
  categoryIds,
} from "./declarations";
import { LelukaAIThumbnail } from "@/components/thumbnails/leluka-ai";

type CategoryCount = Record<string, number>;

const countByCategory = (blocks: BlocksMetadata[]): CategoryCount => {
  return blocks.reduce((acc: CategoryCount, block: BlocksMetadata) => {
    const { category } = block;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
};

const updateCategoryCounts = (
  categories: Omit<BlocksCategoryMetadata, "count">[],
  counts: CategoryCount
): BlocksCategoryMetadata[] => {
  const countsMap = new Map<string, number>(Object.entries(counts));
  return categories.map((category) => ({
    ...category,
    count: (countsMap.get(category.id) || "0").toString(),
  }));
};

const initializeAndUpdateCategories = (): BlocksCategoryMetadata[] => {
  const categoryCounts = countByCategory(blocksMetadata);
  return updateCategoryCounts(preblocksCategoriesMetadata, categoryCounts);
};

const preblocksCategoriesMetadata: Omit<BlocksCategoryMetadata, "count">[] = [
  {
    id: categoryIds.LelukaAI,
    name: "Leluka AI",
    thumbnail: LelukaAIThumbnail,
    hasCharts: false,
  },
];

export const blocksCategoriesMetadata = initializeAndUpdateCategories().sort(
  (a, b) => a.name.localeCompare(b.name)
);
