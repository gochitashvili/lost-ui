"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/config";

export function Footer() {
  return (
    <div className="border-border border-dotted border-t-1">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 border-border border-dotted border-r-1 border-l-1">
        <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-5">
          <div>
            <div className="text-balance text-sm leading-loose text-muted-foreground">
              Built by{" "}
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
                onClick={() => window.stonks?.event("Twitter Link Click")}
              >
                ephraimduncan_
              </a>
              . The source code is available on{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
                onClick={() => window.stonks?.event("GitHub Link Click")}
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
