"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/config";

export function Footer() {
  return (
    <div className="border-border border-dotted border-t">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-8 border-border border-dotted border-r border-l">
        <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-5">
          <div>
            <div className="text-balance text-sm leading-loose text-muted-foreground">
              Built by . The source code is available on{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
                data-umami-event="View GitHub Repository"
              >
                GitHub
              </a>
              .
            </div>
          </div>

          <ThemeSwitcher />
        </footer>
      </div>
    </div>
  );
}
