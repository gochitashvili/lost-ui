import { siteConfig } from "@/config";

export function SeoJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "gocha.dev",
        url: siteConfig.url,
        description: siteConfig.description,
      },
      {
        "@type": "Organization",
        name: "gocha.dev",
        url: siteConfig.url,
        logo: `${siteConfig.url}/favicon.ico`,
        sameAs: [siteConfig.links.twitter, siteConfig.links.github],
      },
    ],
  } as const;

  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
