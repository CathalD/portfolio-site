# Changelog

Notable changes to the site. Content additions are not listed here — the git
history covers those. This file is for changes to how the site _works_.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added — content-ready structure

- Project collection, project pages, tag hubs, and homepage project slots.
- Photograph gallery pages and an ingest command that strips metadata and
  creates draft sidecars and responsive image derivatives.
- Archive views over existing content, plus post-build Pagefind search.
- A guide to the exact content file locations and the temporary Vercel origin.

### Still pending

- The structured CV, Zotero-backed bibliography, video support, and a full
  browser-based accessibility audit need source material or further design.

### Added — Stage 1, Foundation

- Astro 7 static site with TypeScript in strict mode and Tailwind CSS 4.
- Colour palette as CSS custom properties in `src/styles/theme.css`, the only
  file permitted to contain a hex value. Light theme only, by design.
- Source Serif 4 and Inter, self-hosted as variable fonts with no webfont CDN.
- `BaseLayout`, `ProseLayout` and `CollectionLayout`; `BaseHead`, `Nav`,
  `Footer`, `Hero`, `Prose`, `Metadata` and `WritingCard` components.
- `writing` and `pages` content collections with Zod schemas.
- `/`, `/writing`, `/writing/[slug]`, `/about`, `/404`, `/rss.xml` and
  `sitemap-index.xml`.
- Reading time computed from the Markdown source rather than stored in
  frontmatter.
- Validators, all wired into `npm run check` and into CI:
  `validate:content`, `validate:tags`, `validate:refs`, `check:links`,
  `check:a11y`.
- `CLAUDE.md`, `/docs`, `.claude/commands` and `.claude/skills`.
