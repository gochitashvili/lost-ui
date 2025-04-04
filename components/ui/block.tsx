"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { BlocksProps } from "@/lib/blocks";
import { cn } from "@/lib/utils";
import { Copy, Monitor, Smartphone, Tablet } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "./button";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

type BlockViewSize = "desktop" | "tablet" | "mobile";

interface BlockViewState {
  view: "preview" | "code";
  size: BlockViewSize;
}

export const Block = ({ name, blocksId, codeSource, code }: BlocksProps) => {
  const [state, setState] = React.useState<BlockViewState>({
    view: "preview",
    size: "desktop",
  });

  const handleViewChange = (value: string) => {
    setState((prev) => ({ ...prev, view: value as "preview" | "code" }));
  };

  const handleSizeChange = (value: string) => {
    if (value) {
      setState((prev) => ({ ...prev, size: value as BlockViewSize }));
    }
  };

  const handleCopy = () => {
    let cleanCode = typeof code === "string" ? code : "";

    if (cleanCode.startsWith("```")) {
      try {
        const codeBlockRegex = /^```(?:\w+)?\s*\n([\s\S]*?)\n```\s*$/;
        const match = cleanCode.match(codeBlockRegex);

        if (match && match[1]) {
          cleanCode = match[1];
        }
      } catch (error) {
        console.error("Error parsing markdown:", error);
      }
    }

    navigator.clipboard
      .writeText(cleanCode)
      .then(() => {
        toast.success("Code copied to clipboard", {
          duration: 2000,
          position: "bottom-right",
        });
      })
      .catch(() => {
        toast.error("Failed to copy code", {
          duration: 2000,
          position: "bottom-right",
        });
      });
  };

  return (
    <div className="my-24 first:mt-8">
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer font-medium text-foreground sm:text-lg">
            {name}
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              value={state.view}
              onValueChange={handleViewChange}
              className="hidden lg:flex"
            >
              <TabsList className="h-7 items-center rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)] dark:bg-background dark:text-foreground dark:border">
                <TabsTrigger
                  value="preview"
                  className="h-[1.45rem] rounded-sm px-2 text-xs"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="h-[1.45rem] rounded-sm px-2 text-xs"
                >
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="h-7 items-center gap-1.5 rounded-lg border p-0.5 shadow-none lg:flex">
              <ToggleGroup
                type="single"
                value={state.size}
                className="gap-0.5"
                onValueChange={handleSizeChange}
              >
                <ToggleGroupItem
                  value="desktop"
                  className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
                  title="Desktop"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="tablet"
                  className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
                  title="Tablet"
                >
                  <Tablet className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="mobile"
                  className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
                  title="Mobile"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <OpenInV0Button name={blocksId} />
          </div>
        </div>
      </div>
      <div className="relative mt-4 w-full rounded-lg" data-view={state.view}>
        {state.view === "preview" && (
          <div className="relative rounded-lg border border-accent dark:bg-background h-[930px] overflow-auto">
            <iframe
              src={`/blocks/preview/${blocksId}`}
              title={`${name} preview`}
              className={cn(
                "w-full h-full transition-all duration-300 ease-in-out mx-auto",
                {
                  "max-w-full": state.size === "desktop",
                  "max-w-[768px]": state.size === "tablet",
                  "max-w-[390px]": state.size === "mobile",
                }
              )}
              style={{
                width:
                  state.size === "tablet"
                    ? "768px"
                    : state.size === "mobile"
                    ? "390px"
                    : "100%",
              }}
            />
          </div>
        )}

        {state.view === "code" && (
          <div className="rounded-lg overflow-auto max-h-[500px]">
            {codeSource}
          </div>
        )}
      </div>
    </div>
  );
};
