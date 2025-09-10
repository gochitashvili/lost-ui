"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RegistrySetup } from "./registry-setup";
import Logo from "./logo";
import { ThemeSwitcher } from "./theme-switcher";
import { RiGithubFill } from "react-icons/ri";

export function Header() {
  return (
    <div className="border-border bg-background sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-8">
        <Logo className="py-5" />
        <div className="flex items-center gap-2">
          <RegistrySetup />
          <ThemeSwitcher />
          <a
            className={cn(buttonVariants({ variant: "ghost" }))}
            data-umami-event="View GitHub Repository"
            href="https://github.com/gochitashvili/lost-ui"
            rel="noreferrer"
            target="_blank"
          >
            <RiGithubFill className="size-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
