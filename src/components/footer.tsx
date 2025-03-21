import { siteConfig } from "@/config";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  return (
    <footer className="border-grid flex justify-between items-center">
      <div className="container">
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
  );
}
