import { siteConfig } from "../config";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  return (
    <div className="border-border border-dotted border-t-1">
      <div className="mx-auto max-w-screen-lg px-8 border-border border-dotted border-r-1 border-l-1">
        <footer className="flex justify-between items-center py-5">
          <div>
            <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                ephraimduncan
              </a>
              . The source code is available on{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
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
