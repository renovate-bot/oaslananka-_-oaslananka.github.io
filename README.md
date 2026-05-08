# oaslananka.github.io

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/oaslananka/oaslananka.github.io)

VS Code inspired developer portfolio built with Next.js 16 and deployed from a
single canonical repository.

![oaslananka.github.io banner](https://imgur.com/JXJ9mpO.gif)

## Canonical Setup

This repository is the source of truth for the portfolio at
[oaslananka.dev](https://oaslananka.dev/).

- Production app: Vercel
- Canonical domain: `https://oaslananka.dev`
- Source repository: `oaslananka/oaslananka.github.io`
- Legacy GitHub Pages URL: `https://oaslananka.github.io/`

This repository now handles both concerns:

- the main Next.js source code used by Vercel
- a lightweight `docs/` redirect published by GitHub Pages so
  `oaslananka.github.io` keeps forwarding visitors to the canonical domain

## Attribution

This version was forked from and built on top of the original open-source
[`itsnitinr/vscode-portfolio`](https://github.com/itsnitinr/vscode-portfolio)
project by [Nitin Ranganath](https://github.com/itsnitinr), then adapted for my
own portfolio content, GitHub data, and deployment setup.

## Local Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Environment Variables

Create an `.env.local` file when you want live third-party data:

- `DEV_TO_API_KEY`: optional, used to load published DEV.to articles
- `GITHUB_API_KEY`: optional, improves GitHub API rate limits
- `NEXT_PUBLIC_GITHUB_USERNAME`: public GitHub username
- `NEXT_PUBLIC_GITHUB_REPO`: source repository shown inside the portfolio

See [.env.example](./.env.example) for the expected names.

## Managing Content

Most personal content lives in `data/site.ts`.

- Edit `data/site.ts` for name, bio, SEO, links, skills, contact items, and
  terminal copy.
- Edit `data/projects.ts` for featured projects.
- Keep secrets and API keys in `.env.local`.

## Deployment

Deploy the repo on Vercel and keep the custom domain pointed at that deployment.
GitHub Pages is published from the `docs/` directory so the legacy
`oaslananka.github.io` URL continues forwarding visitors to `oaslananka.dev`.

## Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js deployment documentation](https://nextjs.org/docs/deployment)
- [GitHub Pages publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
