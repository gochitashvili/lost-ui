import "@/app/globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist_Mono, Inter } from "next/font/google";
import { siteConfig } from "@/config";
import { SeoJsonLd } from "@/components/seo-jsonld";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: "blocks.so",
  title: {
    default: "blocks.so — Building Blocks for the Web",
    template: "%s — blocks.so",
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
      name: "Ephraim Duncan",
      url: "https://ephraimduncan.com",
    },
  ],
  creator: "Ephraim Duncan",
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
    title: "blocks.so — Building Blocks for the Web",
    description: siteConfig.description,
    siteName: "blocks.so",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "blocks.so Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "blocks.so — Building Blocks for the Web",
    description: siteConfig.description,
    images: ["/og"],
    creator: "@ephraimduncan_",
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
