import { siteConfig } from "@/data/site";
import { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "oaslananka.dev Portfolio Platform",
    description:
      "Production portfolio workspace built with Next.js, typed data models, Vercel deployment, GitHub Pages redirect compatibility, and release-managed operational gates.",
    logo: "/logos/vscode_icon.svg",
    link: siteConfig.links.githubRepo,
    slug: "portfolio-platform",
    status: "active",
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
    highlights: [
      "App Router pages with route-specific metadata, sitemap, and robots output",
      "Server-side GitHub and DEV data integrations with deterministic fallbacks",
      "Legacy GitHub Pages redirect kept separate under docs",
    ],
    links: {
      source: siteConfig.links.githubRepo,
      demo: "https://oaslananka.dev",
    },
  },
  {
    title: "CI/CD and Release Security Baseline",
    description:
      "Repository operations layer for reproducible pnpm installs, pinned GitHub Actions, CodeQL, dependency review, release-please, SBOM, checksums, and provenance.",
    logo: "/logos/vercel.svg",
    link: `${siteConfig.links.githubRepo}/actions`,
    slug: "repo-security-baseline",
    status: "maintained",
    stack: ["GitHub Actions", "CodeQL", "release-please", "pnpm"],
    highlights: [
      "Org-guarded side-effect workflows keep release and security publication scoped",
      "Release assets are generated only after release-please creates a real release",
      "Local task and pnpm scripts mirror the remote quality gates",
    ],
    links: {
      source: `${siteConfig.links.githubRepo}/tree/main/.github/workflows`,
      docs: `${siteConfig.links.githubRepo}/blob/main/README.md`,
    },
  },
  {
    title: "Open Source Repository Index",
    description:
      "Curated gateway to public repositories and contribution activity, enriched by live GitHub data when the API is available.",
    logo: "/logos/vsc.svg",
    link: siteConfig.links.githubRepositories,
    slug: "open-source-index",
    status: "active",
    stack: ["GitHub REST API", "React", "Accessibility"],
    highlights: [
      "Repository list is sorted by stars, forks, and watchers for quick scanning",
      "Unavailable live data is shown explicitly instead of being presented as zero",
      "Profile and repository links remain usable when the API is rate-limited",
    ],
    links: {
      demo: "https://oaslananka.dev/open-source",
      source: `${siteConfig.links.githubRepo}/blob/main/app/open-source/page.tsx`,
    },
  },
];
