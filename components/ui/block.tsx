"use client";

import blocksComponents from "@/content/blocks-components";
import { BlocksProps } from "@/lib/blocks";
import { cn } from "@/lib/utils";

export const Block = ({ name, blocksId, blocksCategory }: BlocksProps) => {
  const BlocksComponent = blocksComponents[blocksId];

  const noPaddingCategories = ["page-shells", "logins"];
  const applyPadding = !noPaddingCategories.includes(blocksCategory);

  return (
    <>
      <div className="mt-8 first:mt-0">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 cursor-pointer font-medium text-foreground sm:text-lg">
            {name}
          </div>
        </div>
      </div>
      <div className="relative mt-4 w-full rounded-lg ring-1 ring-accent">
        <div
          className={cn(
            "rounded-lg bg-white transition-all dark:bg-gray-950",
            applyPadding ? "p-4 sm:p-10" : "overflow-hidden"
          )}
        >
          <BlocksComponent />
        </div>
      </div>
    </>
  );
};
