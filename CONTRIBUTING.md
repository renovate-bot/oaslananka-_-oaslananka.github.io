# Contributing

Thank you for your interest in contributing to this portfolio project.

## Scope

This is a personal portfolio. Contributions are welcome for:

- Bug fixes: broken links, layout issues, accessibility problems
- Content suggestions: via Issues, no direct content PRs
- Performance improvements: Core Web Vitals, bundle size
- Accessibility: WCAG 2.1 improvements

## Setup

```bash
git clone https://github.com/oaslananka/oaslananka.github.io.git
cd oaslananka.github.io
pnpm install
pnpm dev
```

## Before Submitting a PR

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

All three must pass without errors.

## Commit Convention

This project uses
[Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(layout): add dark mode toggle
fix(seo): correct meta description for projects page
chore(deps): update next to 16.3.0
```

## Code Style

- ESLint and Prettier handle formatting automatically.
- Run `pnpm run lint:fix` and `pnpm run format` before committing.
- Husky pre-commit hook runs `lint-staged` automatically.

## Pull Request Process

1. Fork the repository.
2. Create a branch such as `fix/broken-nav-link` or `feat/add-blog-section`.
3. Make your changes.
4. Run `pnpm run ci` to verify everything passes.
5. Open a PR against `main`.

PRs that fail CI checks will not be reviewed.
