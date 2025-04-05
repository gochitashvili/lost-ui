import "@/app/globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "blocks",
  description: "blocks.so",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(fontSans.variable, fontMono.variable, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}

          <TailwindIndicator />
          <Toaster />
        </ThemeProvider>
      </body>

      {process.env.NODE_ENV === "production" && (
        <Script
          async
          src="https://analytics.duncan.land/script.js"
          data-website-id="1671be23-4bb0-43b1-9632-962a463265e8"
        />
      )}
    </html>
  );
}
