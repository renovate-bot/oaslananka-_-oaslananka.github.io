import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

export const indexedRoutes = [
  { path: "/", title: "Home", priority: 1 },
  { path: "/about", title: "About", priority: 0.8 },
  { path: "/projects", title: "Projects", priority: 0.8 },
  { path: "/articles", title: "Articles", priority: 0.7 },
  { path: "/open-source", title: "Open Source", priority: 0.7 },
  { path: "/contact", title: "Contact", priority: 0.6 },
  { path: "/settings", title: "Settings", priority: 0.3 },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.links.primaryDomain).toString();
}

export function createPageMetadata({
  title,
  description = siteConfig.seo.description,
  path,
}: {
  title?: string;
  description?: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = title
    ? `${siteConfig.owner.name} | ${title}`
    : siteConfig.seo.defaultTitle;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      images: [
        {
          url: siteConfig.seo.image,
          width: 1200,
          height: 630,
          alt: siteConfig.seo.defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [siteConfig.seo.image],
    },
  };
}
