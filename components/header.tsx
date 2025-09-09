"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconSquareRoundedFilled } from "@tabler/icons-react";
import { RegistrySetup } from "./registry-setup";
import Logo from "./logo";

export function Header() {
  return (
    <div className="sticky top-0 z-50 border-border border-b border-dotted bg-background">
      <div className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between border-border border-r border-l border-dotted px-4 sm:px-8">
        <Logo className="py-5" />
        <div className="flex items-center gap-2">
          <RegistrySetup />
          <a
            className={cn(buttonVariants({ variant: "ghost" }))}
            data-umami-event="View GitHub Repository"
            href="https://github.com/gochitashvili/lost-ui"
            rel="noreferrer"
            target="_blank"
          >
            <IconBrandGithub className="size-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
