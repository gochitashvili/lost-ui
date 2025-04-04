"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { BlocksProps } from "@/lib/blocks";
import { Copy, Fullscreen, Monitor, Smartphone, Tablet } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { toast } from "sonner";
import { Button } from "./button";
import { Separator } from "./separator";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

interface BlockViewState {
  view: "preview" | "code";
  size: "desktop" | "tablet" | "mobile";
}

export const Block = ({
  name,
  blocksId,
  codeSource,
  code,
  meta,
}: BlocksProps & { meta?: { iframeHeight?: string } }) => {
  const [state, setState] = React.useState<BlockViewState>({
    view: "preview",
    size: "desktop",
  });

  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);
  const iframeHeight = meta?.iframeHeight ?? "930px";

  const handleViewChange = (value: string) => {
    setState((prev) => ({ ...prev, view: value as "preview" | "code" }));
  };

  const handleSizeChange = (value: string) => {
    if (value) {
      setState((prev) => ({
        ...prev,
        size: value as "desktop" | "tablet" | "mobile",
      }));

      if (resizablePanelRef?.current) {
        switch (value) {
          case "desktop":
            resizablePanelRef.current.resize(100);
            break;
          case "tablet":
            resizablePanelRef.current.resize(60);
            break;
          case "mobile":
            resizablePanelRef.current.resize(30);
            break;
        }
      }
    }
  };

  const handleCopy = () => {
    let cleanCode = typeof code === "string" ? code : "";

    if (cleanCode.startsWith("````")) {
      try {
        const codeBlockRegex = /^````(?:\w+)?\s*\n([\s\S]*?)\n````\s*$/;
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
    <div
      className="my-24 first:mt-8"
      id={blocksId}
      data-view={state.view}
      style={{ "--height": iframeHeight } as React.CSSProperties}
    >
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer font-medium text-foreground sm:text-lg">
            <a
              href={`#${blocksId}`}
              className="text-sm font-medium underline-offset-2 hover:underline"
            >
              {name}
            </a>
          </div>
          <div className="flex items-center">
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
            <Separator
              orientation="vertical"
              className="mx-2 hidden h-4 lg:flex"
            />
            <div className="ml-auto hidden h-7 items-center gap-1.5 rounded-md border p-[2px] shadow-none lg:flex">
              <ToggleGroup
                type="single"
                value={state.size}
                onValueChange={(value) => {
                  handleSizeChange(value);
                }}
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
                <Separator orientation="vertical" className="h-4" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-[22px] w-[22px] rounded-sm p-0"
                  asChild
                  title="Open in New Tab"
                >
                  <Link href={`/blocks/preview/${blocksId}`} target="_blank">
                    <span className="sr-only">Open in New Tab</span>
                    <Fullscreen className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </ToggleGroup>
            </div>
            <Separator
              orientation="vertical"
              className="mx-1 hidden h-4 md:flex"
            />
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
            <Separator
              orientation="vertical"
              className="mx-1 hidden h-4 xl:flex"
            />
            <OpenInV0Button name={blocksId} />
          </div>
        </div>
      </div>

      <div className="relative mt-4 w-full">
        {state.view === "preview" && (
          <div className="md:h-[--height]">
            <div className="grid w-full gap-4">
              <ResizablePanelGroup
                direction="horizontal"
                className="relative z-10"
              >
                <ResizablePanel
                  ref={resizablePanelRef}
                  className="relative rounded-lg border border-accent bg-background"
                  defaultSize={100}
                  minSize={30}
                >
                  <iframe
                    src={`/blocks/preview/${blocksId}`}
                    title={`${name} preview`}
                    height={meta?.iframeHeight ?? 930}
                    className="relative z-20 w-full bg-background"
                  />
                </ResizablePanel>
                <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
                <ResizablePanel defaultSize={0} minSize={0} />
              </ResizablePanelGroup>
            </div>
          </div>
        )}

        {state.view === "code" && (
          <div className="group-data-[view=preview]/block-view-wrapper:hidden md:h-[--height] rounded-lg overflow-auto">
            {codeSource}
          </div>
        )}
      </div>
    </div>
  );
};
