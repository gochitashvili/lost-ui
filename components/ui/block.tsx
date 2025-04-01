"use client";

import blocksComponents from "@/content/blocks-components";
import { BlocksProps } from "@/lib/blocks";
import { cn } from "@/lib/utils";
import { Copy, Monitor, Smartphone, Tablet } from "lucide-react";
import * as React from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { toast } from "sonner";
import { Button } from "./button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

interface BlockViewState {
  view: "preview" | "code";
  size: number;
}

export const Block = ({
  name,
  blocksId,
  blocksCategory,
  codeSource,
  code,
}: BlocksProps) => {
  const BlocksComponent = blocksComponents[blocksId];
  const [state, setState] = React.useState<BlockViewState>({
    view: "preview",
    size: 100,
  });
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);

  const noPaddingCategories = ["stats"];
  const applyPadding = !noPaddingCategories.includes(blocksCategory);

  const handleViewChange = (value: string) => {
    setState((prev) => ({ ...prev, view: value as "preview" | "code" }));
  };

  const handleSizeChange = (value: string) => {
    const size = parseInt(value);
    setState((prev) => ({ ...prev, size }));
    if (resizablePanelRef.current) {
      resizablePanelRef.current.resize(size);
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
            <div className="h-7 items-center gap-1.5 rounded-md border p-[2px] shadow-none lg:flex">
              <ToggleGroup
                type="single"
                value={state.size.toString()}
                onValueChange={handleSizeChange}
              >
                <ToggleGroupItem
                  value="100"
                  className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
                  title="Desktop"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="60"
                  className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
                  title="Tablet"
                >
                  <Tablet className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="30"
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
          </div>
        </div>
      </div>
      <div className="relative mt-4 w-full rounded-lg" data-view={state.view}>
        {state.view === "preview" && (
          <ResizablePanelGroup direction="horizontal" className="relative">
            <ResizablePanel
              ref={resizablePanelRef}
              className="relative rounded-lg border border-accent transition-all dark:bg-background"
              defaultSize={100}
              minSize={30}
            >
              <div
                className={cn(
                  "rounded-lg bg-white transition-all dark:bg-background",
                  applyPadding ? "p-4 sm:p-10" : "overflow-hidden"
                )}
              >
                <BlocksComponent />
              </div>
            </ResizablePanel>
            <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
            <ResizablePanel defaultSize={0} minSize={0} />
          </ResizablePanelGroup>
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
