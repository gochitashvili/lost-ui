import "@/app/globals.css";
import { SeoJsonLd } from "@/components/seo-jsonld";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { DM_Sans, Geist_Mono } from "next/font/google";

const fontSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: "lost-ui.vercel.app",
  title: {
    default: "lost-ui.vercel.app — Building Blocks for the Web",
    template: "%s — lost-ui.vercel.app",
  },
  description: siteConfig.description,
  keywords: [
    "React UI blocks",
    "Tailwind components",
    "shadcn/ui",
    "Next.js components",
    "Open source UI",
    "Copy paste components",
  ],
  authors: [
    {
      name: "Gocha Gochitashvili",
      url: "https://lost-ui.vercel.app",
    },
  ],
  creator: "Gocha Gochitashvili",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "lost-ui.vercel.app — Building Blocks for the Web",
    description: siteConfig.description,
    siteName: "lost-ui.vercel.app",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "lost-ui.vercel.app — Building Blocks for the Web",
    description: siteConfig.description,
    creator: "@gochitashvili_",
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(fontSans.variable, fontMono.variable, "antialiased")}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
          <TailwindIndicator />
          <Toaster />
          <SeoJsonLd />
        </ThemeProvider>
      </body>
    </html>
  );
}
