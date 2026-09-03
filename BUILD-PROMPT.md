# Build specification — cathaldoherty.ca

This is the original specification the site was built from, kept verbatim so
that a future session can see the intent rather than only the result.

**It is a historical record, not a live instruction.** Where the build
deviated from it, the reason is recorded in `CLAUDE.md` and in
`docs/architecture-decisions.md`, and those files are authoritative. A list of
the known deviations is at the bottom of this page.

---

## Role

You are building a personal website and long-term work archive for Cathal
Doherty, a conservation biologist in Toronto. This is not a portfolio template.
It is a piece of software that will be maintained for a decade and edited
primarily through AI assistance rather than by a web developer.

Optimise every decision for: **maintainability, legibility to a future AI
session, and content durability.** Where those conflict with cleverness, choose
them.

## Hard constraints

1. **Do not write any real content.** No project descriptions, no essays, no
   biography text, no research summaries, no publication entries. Not even
   "realistic placeholders." The owner is a scientist; fabricated methods,
   invented findings, or plausible-looking citations under his name are a
   reputational problem, not a placeholder.
2. **Scaffolding fixtures are permitted, under strict rules.** To verify
   layouts render, create fixture entries that are _transparently_ non-real:
   titles like `Fixture Project One`; body text that is structural filler,
   never plausible scientific prose; no real place names, species names, dates
   tied to real events, DOIs, or author names; every fixture has `draft: true`,
   lives under `content/*/` prefixed `_fixture-`, is excluded from production
   builds, and a validator (`npm run validate:content`) **fails the build** if
   any `_fixture-` entry would be published.
3. **Ask before inventing.** If a schema field, taxonomy value, or piece of
   copy is needed and not specified, add a `TODO(cathal):` comment and ask. Do
   not guess and do not fill it in.
4. **No dark mode.** Light theme only. Colours still go through CSS custom
   properties in one file, but there is no second theme.

## Stack

Astro (latest stable, static output), Tailwind CSS, TypeScript `strict`, Astro
Content Collections with Zod schemas, Pagefind for search, `@astrojs/rss`,
`@astrojs/sitemap`, `astro:assets`, `sharp` + `exifr` for the image pipeline,
Vercel deployment via GitHub, Node version pinned in `.nvmrc` and `engines`.

Minimal dependencies. Every added package needs a one-line justification in
`CLAUDE.md`.

## Design

The site should feel like a well-made field notebook or an academic press book.
Restrained, engineered, warm.

- Classic typography. One serif for body/long-form, one sans for UI and
  metadata. Self-host the fonts with `font-display: swap` — no Google Fonts CDN
  dependency.
- Generous whitespace. Long-form measure capped around 68–72 characters.
- Sharp edges. Border radius 0 or 2px, nothing more.
- Subtle greens and warm neutrals. Full palette as CSS custom properties in
  `src/styles/theme.css`. Nothing anywhere else may hardcode a hex value.
- Restrained shadows — hairline borders preferred.
- No gradients, no glassmorphism, no scroll-triggered animation. Transitions
  limited to hover/focus, under 200ms, wrapped in `prefers-reduced-motion`.

**Accessibility is a build gate, not an aspiration.** WCAG 2.1 AA. Semantic
HTML, visible focus rings, skip-to-content link, all interactive elements
keyboard-reachable, all images with meaningful alt text. Contrast ratios
verified, not assumed.

## Information architecture

Navigation: Home · CV · Projects · Writing · Gallery · Archive

URL structure, fixed permanently:

```
/                        home
/cv                      CV
/projects                index
/projects/[slug]         detail
/writing                 index
/writing/[slug]          detail
/gallery                 index
/gallery/[slug]          detail
/archive                 timeline, all years
/archive/[year]          single year
/tags/[tag]              tag hub
/search                  Pagefind UI
/rss.xml  /sitemap-index.xml
```

Slugs never change. If a title changes, the slug stays and the old title lives
in a `formerTitles` array.

## Content model

One entry per file. **No multi-file projects** — a project is a single
`index.md` whose optional sections are H2 headings, and the layout builds a
sidebar TOC from whichever headings exist.

### `content/projects/[slug]/index.md`

`title`, `summary`, `status` (`taking-off` | `in-progress` | `completed` |
`archived`), `year`, `endYear?`, `duration?`, `tags` (validated against
`data/tags.yaml`), `featured?`, `heroImage?`, `heroAlt?` (required if
`heroImage`), `relatedProjects?`, `relatedWriting?`, `downloads?`,
`references?` (BibTeX keys validated against the `.bib`), `draft`,
`publishedAt?`, `updatedAt?`.

Conventional H2 sections, all optional: Overview, Planning, Build, Results,
Reflection, Equipment, Code, Budget, Maps, Videos.

### `content/writing/[slug].md`

`title`, `summary`, `category` (`essay` | `technical` | `teaching` |
`research` | `idea` | `review`), `tags`, `publishedAt`, `updatedAt?`,
`readingTime?` (computed at build, not hand-entered), `references?`,
`relatedProjects?`, `substackUrl?`, `heroImage?`, `heroAlt?`, `draft`.

Canonical URL is always this site. Substack is a link out, never a sync target.

### `content/gallery/[slug].md`

`title`, `alt` (**required**), `caption?`, `mediaType`, `src` (resolved through
`lib/media.ts`), `capturedAt?`; EXIF-derived `camera?`, `lens?`,
`focalLength?`, `aperture?`, `shutterSpeed?`, `iso?`, `drone?`; manual
`species?`, `location?` (coarse), `coordinates?` (**omitted by default**),
`project?`, `season?`, `tags`, `draft`.

### `content/cv/cv.yaml` + `content/references/library.bib`

The CV is structured YAML, never prose markdown. Publications are **generated
from the BibTeX file exported from Zotero** — never hand-typed. `lib/
bibliography.ts` parses the `.bib`, renders citations consistently, and exposes
them to both the CV page and the reference-list component. A reference key used
in content but missing from the `.bib` fails the build.

### `content/data/`

`tags.yaml` (canonical tag list: `slug`, `label`, `description?`, `group?`),
`topics.yaml`, `timeline.yaml`, `authors.yaml`.

**Tag enforcement:** `npm run validate:tags` fails the build on any tag present
in content but absent from `tags.yaml`. This is what prevents `eelgrass` /
`Eelgrass` / `seagrass` drift.

## Archive

The archive is a real destination with its own timeline UI — **but it is a view
over the existing collections, not a separate folder.** `/archive` renders a
chronological vertical timeline merging all projects, writing, gallery items
and `timeline.yaml`, grouped by year, newest first. `/archive/[year]` renders
one year. Filters by content type and by tag. Entries with `status: 'archived'`
render with a muted badge but stay fully accessible at their original URL.
Nothing is ever deleted, moved, or allowed to break.

**Archiving a year** is flipping `status` on the relevant entries. A script and
skill (`archive-year`) takes a year, lists everything from it, shows the diff,
and asks for confirmation before writing.

## Image pipeline

Full-resolution originals live outside the repository. Only web derivatives are
committed. `scripts/ingest-media.ts`:

1. Reads `content/gallery/_inbox/` (gitignored)
2. Extracts EXIF via `exifr`
3. Generates AVIF + WebP derivatives at 480 / 960 / 1600 / 2400
4. Writes them to `public/images/gallery/[slug]/`
5. Writes a `content/gallery/[slug].md` sidecar with EXIF pre-filled and
   `TODO(cathal):` markers on `alt`, `caption`, `species`, `project`
6. **Strips GPS coordinates by default.** Only writes `coordinates` if the file
   is listed in `scripts/geo-allowlist.txt`. Sensitive species locations must
   not be published by accident.
7. Never mutates or deletes the original

All image paths resolve through `src/lib/media.ts`. No component ever builds an
image URL itself, so a future CDN migration is a single-file change.

## Search

Pagefind indexed post-build, `/search` page with its UI, keyboard accessible,
no client-side JS beyond Pagefind's own. Drafts and fixtures excluded.

## Components

`BaseHead` · `Nav` · `Footer` · `Hero` · `ProjectCard` · `WritingCard` ·
`GalleryCard` · `Tag` · `StatusBadge` · `Timeline` · `TimelineEntry` ·
`ReferenceList` · `DownloadCard` · `ImageGallery` · `Lightbox` · `VideoEmbed` ·
`Quote` · `Prose` · `TableOfContents` · `Metadata` · `Pagination`

Each with a typed `Props` interface and a header comment stating its purpose
and where it is used.

Layouts: `BaseLayout` · `ProseLayout` · `CollectionLayout`. **No duplicated
layout logic** — every page composes these.

## Homepage

Full-width landscape hero image, overlaid with:

> **Cathal Doherty**
>
> Understanding environmental systems, applying science to outcomes, building
> practical tools, and sharing what I learn.
>
> Conservation Biologist based in Canada.

Overlay text must meet AA contrast against the image — solid or near-solid
scrim, not a gradient. Below: short About section (an empty
`content/pages/about.md` with a `TODO(cathal)` — do not write it), three
featured project cards, current projects, latest writing, footer.

## Build in four stages

Stop at the end of each stage. Summarise what changed, what to look at, and
what decisions are open. Do not proceed until told to.

1. **Foundation.** Astro + Tailwind + TS, theme tokens, fonts, `BaseLayout`,
   `Nav`, `Footer`, `Prose`, SEO head, sitemap, RSS, `writing` collection, one
   fixture post, `/writing` and `/writing/[slug]`. Deploy to Vercel.
2. **Projects and taxonomy.** `projects` collection, `data/*.yaml`, tag
   validator, `/projects`, `/projects/[slug]` with TOC, `Tag`, `StatusBadge`,
   `ProjectCard`, `/tags/[tag]`, homepage.
3. **Media.** `gallery` collection, ingest script, `media.ts`, `ImageGallery`,
   `Lightbox`, `VideoEmbed`, `/gallery`, `/gallery/[slug]`.
4. **Archive, CV, search, hardening.** `timeline.yaml`, `Timeline`, `/archive`,
   `/archive/[year]`, `archive-year` script, BibTeX parsing, `/cv` + PDF,
   Pagefind, full a11y audit, all validators in CI.

## Repository scaffolding

`CLAUDE.md` at repo root — the single most important file for the ten-year
goal: what this is and who maintains it; architecture decisions **with their
reasons**; the permanent URL contract; frontmatter schemas; commands; the
content rule stated unmissably; conventions; and a "things that look wrong but
are deliberate" section.

`.claude/skills/` — `add-project`, `publish-writing`, `add-gallery-items`,
`update-cv`, `archive-year`, `new-component`.

`.claude/commands/` — `/check`, `/preview`, `/publish`.

Quality gates: npm scripts `dev`, `build`, `check`, `typecheck`,
`validate:tags`, `validate:content`, `validate:refs`, `check:links`, `ingest`,
`cv:pdf`. GitHub Actions runs `check` on every PR.
`.github/pull_request_template.md` with a **content review checklist**.

Repo hygiene: `.gitignore`, `.editorconfig`, Prettier + ESLint with the Astro
plugins, `.nvmrc`, MIT `LICENSE` for code with content rights reserved,
`CHANGELOG.md`.

## Documentation — `/docs`

Written for someone who is not a web developer and may be reading it in 2032.
Prose, not bullet dumps. Every doc states what to do when it goes wrong.

`README.md` · `running-locally.md` · `deploying.md` · `adding-a-project.md` ·
`adding-a-blog-post.md` · `adding-gallery-items.md` · `updating-the-cv.md` ·
`content-collections.md` · `creating-components.md` · `taxonomy.md` ·
`architecture-decisions.md` · `troubleshooting.md`

## Working style

Small, coherent commits, Conventional Commits. Feature branches and PRs. Run
`check` before declaring a stage done; if it fails, fix it. When a decision has
a real trade-off, name it and ask. If something in this spec turns out to be a
bad idea once you are in the code, say so.

---

# Deviations from this specification

Recorded here so a future session does not read the spec above and conclude
that something was forgotten.

**Fixture exclusion is not in `astro.config.mjs`.** Astro has no
content-exclusion hook there. It is done in the glob loader plus the single
`getPublished()` helper in `src/lib/content.ts`, and re-checked independently
by `validate:content`. Same guarantee, correct location.

**`readingTime` is not a frontmatter field.** The spec listed it as an optional
field computed at build. If it is in the schema, someone will hand-enter it and
it will go stale, so it was removed from the schema entirely and is computed
from the raw Markdown. It is also computed _without_ a Markdown plugin, because
Astro 7 replaced unified/remark as the default processor and hooking into the
new one would have meant adding a compatibility package.

**Branch protection was not enabled in Stage 1**, and Stage 1 was committed
directly to `main`, at Cathal's direction. Requiring an approving review would
have locked a solo maintainer out of merging anything, since GitHub forbids
approving your own pull request.

**The Vercel connection was not made by the AI session.** It requires signing
in to Vercel, which an AI session should not do on someone's behalf. The
configuration is committed and `docs/deploying.md` gives the click-path.

**Automated accessibility auditing is not in Stage 1's `check`.** A real audit
needs a headless browser, which is a heavy dependency, and the spec schedules
the full audit for Stage 4. What Stage 1 ships instead is
`scripts/check-a11y.ts`, which verifies every colour-contrast pair the site
uses and fails the build on a stray hex. Landmark, label and focus-order
auditing joins that file in Stage 4.

**Only two skills were written in Stage 1**, `publish-writing` and
`new-component` — the two whose machinery exists. `add-project`,
`add-gallery-items`, `update-cv` and `archive-year` all depend on collections
or scripts that arrive in later stages; writing them now would have produced
skills that reference files that do not exist.

**`content/data/tags.yaml` is empty.** The spec asks for a canonical tag list;
the taxonomy is Cathal's to decide and guessing at it would have been inventing
content. Stage 2 asks for it.
