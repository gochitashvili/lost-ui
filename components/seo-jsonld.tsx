import { siteConfig } from "@/config";

export function SeoJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "lost-ui.vercel.app",
        url: siteConfig.url,
        description: siteConfig.description,
      },
      {
        "@type": "Organization",
        name: "lost-ui.vercel.app",
        url: siteConfig.url,
        logo: `${siteConfig.url}/favicon.ico`,
        sameAs: [siteConfig.links.github],
      },
    ],
  } as const;

  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
