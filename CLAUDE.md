# CLAUDE.md

Guidance for any AI session — or any person — working on this repository.

Read this file before changing anything. Most of what follows is not style
preference. It is a set of decisions that were made once, for reasons, and that
are easy to undo by accident because the reason is not visible in the code.

---

## What this is

The personal website and long-term work archive of **Cathal Doherty**, a
conservation biologist based in Toronto. It currently lives at
[portfolio-site-phi-six-42.vercel.app](https://portfolio-site-phi-six-42.vercel.app/).
The final domain has not been purchased. When it is, update the canonical
origin in `astro.config.mjs` and the sitemap origin in `public/robots.txt`
together.

It is not a portfolio template. It is expected to be maintained for a decade,
and to be edited primarily through AI assistance rather than by a web
developer. Optimise every decision for **maintainability, legibility to a
future session, and content durability** — in that order, ahead of cleverness.

**Cathal maintains the content. The AI maintains the code.** He is not going to
debug a build failure, so the build has to fail loudly, early, and with a
message that says what to do.

---

## THE CONTENT RULE

**Never invent content. Never fabricate a citation. Never fill in a
`TODO(cathal)`. Ask.**

This is the single most important rule in the repository, and it is not
negotiable.

The site carries the name of a working scientist. Invented project
descriptions, plausible-sounding methods, made-up findings, fabricated species
records, or a citation that looks real but is not are a **reputational
problem**, not a placeholder. "I'll write a realistic draft for him to edit" is
how a fabricated method ends up published, because a realistic draft is exactly
the kind of thing that gets skimmed and approved.

Concretely, this means:

- Do not write project descriptions, essays, biography text, research
  summaries, publication entries, or photo captions.
- Do not invent species names, place names, dates, coordinates, DOIs, or
  co-author names — not even as examples.
- Do not fill in a `TODO(cathal)` marker. They are questions addressed to
  Cathal. Answering one on his behalf defeats the point of leaving it.
- If a field, a taxonomy value, or a piece of copy is needed and is not
  specified, **add a `TODO(cathal):` comment and ask.**

`npm run validate:content` fails the build if a `TODO(cathal)` marker reaches
the built HTML, so an unanswered question cannot be published by accident.

### Scaffolding fixtures — the one permitted exception

To verify that layouts render, fixtures are allowed under strict rules:

- Named `_fixture-*`, e.g. `content/writing/_fixture-essay-a.md`
- Titled transparently: `Fixture Essay A`, `Fixture Project One`
- Body text is structural filler (`Section heading`, `Body paragraph
placeholder text.`) — never anything resembling scientific prose
- No real place names, species names, dates tied to real events, DOIs, or
  author names
- Always `draft: true`

Fixtures are excluded from production builds two independent ways: the
`draft` flag and the `_fixture-` prefix, both applied in
`src/lib/content.ts`. `npm run validate:content` then re-checks the built
output and **fails the build** if one leaked. Two independent checks of the
same rule is deliberate — a bug in the filter is caught rather than shipped.

---

## The permanent URL contract

These paths are fixed. **They do not change, ever.**

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
/about                   About
/rss.xml
/sitemap-index.xml
```

**A slug never changes.** The slug is the filename in `content/`. If a title
changes, the slug stays exactly as it is and the old title goes into the
`formerTitles` array in frontmatter, where the page renders it as "Previously
published as …".

Renaming a file to "tidy up" a slug breaks every inbound link, every citation
of the page, and every bookmark, silently and permanently. `npm run
check:links` verifies that nothing inside the site links to a URL that does not
exist, but it cannot see the links other people have made to this one.

Nothing is ever deleted. Nothing is ever moved. Archiving is a **status
change**, not a relocation — see below.

---

## Architecture decisions, and why

A future session that does not know _why_ will undo these. Each of these was a
real trade-off.

### One file per project. No multi-file projects.

A project is a single `content/projects/[slug]/index.md`. Its optional sections
are `##` headings, and the layout builds a sidebar table of contents from
whichever headings happen to exist.

_Why:_ a folder of `overview.md`, `methods.md`, `results.md` seems tidier but
means the writer has to decide which file a paragraph belongs in before writing
it, and it makes "read the whole project" an assembly job. One file is one
thought. The sections that exist are the sections that were needed.

### The archive is a status, not a folder.

`/archive` is a **view over the existing collections** — projects, writing,
gallery items, and the milestones in `timeline.yaml` — merged and grouped by
year. Archiving something means setting `status: 'archived'` on it. The entry
keeps its original URL, stays fully accessible, and renders with a muted
"Archived" badge.

_Why:_ the obvious alternative is moving old work into an `archive/` folder.
That breaks every URL it touches, which violates the URL contract above. It
also makes "everything from 2021" impossible to answer without knowing which
things were archived and which were not.

### All image paths go through `src/lib/media.ts`.

No component ever builds an image URL itself. (Added in Stage 3.)

_Why:_ it makes a future migration to an external CDN a one-file change instead
of a repository-wide search. Over ten years, the odds of never changing where
images are served from are low.

### Publications come from BibTeX, never hand-typed.

`content/references/library.bib` is exported from Zotero. Content cites entries
by key. `npm run validate:refs` fails the build if a cited key is missing from
the `.bib`.

_Why:_ a hand-typed citation is a fabrication risk and a consistency risk. The
`.bib` is the single source of truth, Zotero is where it is edited, and the
site is downstream of both. **Never add an entry to the `.bib` by hand** — fix
it in Zotero and re-export.

### There is no dark mode.

Light theme only. No toggle, no `dark:` variants, no `prefers-color-scheme`
palette.

_Why:_ the design is a field notebook / academic press book — warm paper, deep
ink. A dark inversion of that is a different design, and maintaining two means
verifying every contrast pair twice, forever. Colours still go through CSS
custom properties in one file, which is good practice regardless of how many
themes there are.

If someone asks for dark mode later, that is a design decision for Cathal, not
a small addition.

### Reading time is computed, never stored.

`readingTime` is deliberately absent from the frontmatter schema. It is
computed from the raw Markdown by `src/lib/reading-time.ts`.

_Why:_ a hand-entered reading time is wrong the first time the post is edited.
It is also computed from the raw source rather than through a Markdown plugin,
so it does not depend on which Markdown engine Astro ships — which already
changed once, in Astro 7.

### Content lives in `content/` at the repository root.

Not in `src/content/`.

_Why:_ the person who edits this site writes prose, not TypeScript. The folder
he opens every week should not be buried inside the source tree. Astro's glob
loader reads from anywhere, so this costs nothing.

### One chokepoint decides what is publishable.

Every page, the RSS feed and the sitemap read collections through
`getPublished()` in `src/lib/content.ts`. **No page calls `getCollection()`
directly.**

_Why:_ it is the only way to make "a draft never reaches production" a
guarantee rather than a habit. In `astro dev` drafts and fixtures are visible,
so work in progress can be seen; in `astro build` they are filtered out.

### GPS coordinates are stripped from photographs by default.

The ingest script (Stage 3) removes GPS EXIF unless the file is explicitly
listed in `scripts/geo-allowlist.txt`.

_Why:_ publishing the coordinates of a sensitive species location can get that
population poached or disturbed. Opt-in is the only safe default, and the
allowlist is gitignored so it is a per-machine, deliberate act.

---

## Conventions

**No hex value outside `src/styles/theme.css`.** Every colour is a semantic
token (`--color-ink-muted`, not `--color-grey-600`) defined in that one file.
`npm run check:a11y` greps `src/` and `scripts/` and fails the build on a stray
hex. The one documented exception is `public/favicon.svg`, which is served as a
static file and cannot read a CSS custom property.

**No image URL construction outside `src/lib/media.ts`.** (Stage 3.)

**No new dependency without a one-line justification** in the table below.

**Base element styles go in `@layer base`.** Un-layered CSS beats every
Tailwind utility regardless of specificity, so an un-layered `a { text-
decoration: underline }` silently defeats every `no-underline` in the codebase.
This has already happened once.

**Every component has a header comment** stating what it is and where it is
used, and a typed `Props` interface.

**Accessibility is a build gate.** WCAG 2.1 AA. Semantic HTML, a visible focus
ring on everything focusable, a working skip link, `alt` text on every image
(the gallery schema makes it required). Contrast ratios are _verified_ by
`npm run check:a11y`, not assumed.

---

## Commands

| Command                    | What it does                                                              |
| -------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`              | Dev server on :4321. Shows drafts and fixtures.                           |
| `npm run build`            | Production build to `dist/`. Excludes drafts and fixtures.                |
| `npm run preview`          | Serve the production build locally.                                       |
| `npm run check`            | **Everything below, in order.** Run before declaring anything done.       |
| `npm run typecheck`        | `astro check` — TypeScript and Astro diagnostics.                         |
| `npm run lint`             | ESLint.                                                                   |
| `npm run format`           | Prettier, writing in place.                                               |
| `npm run validate:tags`    | Every tag used in content exists in `tags.yaml`.                          |
| `npm run validate:refs`    | Every citation key exists in `library.bib`.                               |
| `npm run validate:content` | No draft, fixture or `TODO(cathal)` reached `dist/`. Needs a build first. |
| `npm run check:links`      | Every internal link in `dist/` resolves. Needs a build first.             |
| `npm run check:a11y`       | Contrast ratios meet AA; no stray hex values.                             |

`validate:content` and `check:links` read `dist/`, so they run _after_ `build`.
That ordering is baked into `npm run check`.

---

## Frontmatter schemas

Defined in **`src/content.config.ts`**. That file is authoritative — this table
is a map, not a copy.

| Collection | Path                               | Stage |
| ---------- | ---------------------------------- | ----- |
| `writing`  | `content/writing/[slug].md`        | 1     |
| `pages`    | `content/pages/[slug].md`          | 1     |
| `projects` | `content/projects/[slug]/index.md` | 2     |
| `gallery`  | `content/gallery/[slug].md`        | 3     |

Supporting data:

| File                             | What it is                                                   |
| -------------------------------- | ------------------------------------------------------------ |
| `content/data/tags.yaml`         | The canonical tag list. A tag not in here fails the build.   |
| `content/data/topics.yaml`       | Higher-level groupings of tags. (Stage 2)                    |
| `content/data/timeline.yaml`     | Archive milestones that are not projects or posts. (Stage 4) |
| `content/references/library.bib` | Zotero export. Never edited by hand. (Stage 4)               |
| `content/cv/cv.yaml`             | Structured CV. Never prose Markdown. (Stage 4)               |

---

## Dependencies, and why each one is here

| Package                                                                       | Justification                                                                                |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `astro`                                                                       | The framework. Static output.                                                                |
| `@astrojs/rss`                                                                | Generates `/rss.xml`. First-party, ~0 transitive deps.                                       |
| `@astrojs/sitemap`                                                            | Generates `sitemap-index.xml`. First-party.                                                  |
| `sharp`                                                                       | Image processing behind `astro:assets`; also used by the ingest script.                      |
| `tailwindcss`, `@tailwindcss/vite`                                            | Styling. Its `@theme` block is how `theme.css` becomes both custom properties and utilities. |
| `@astrojs/check`, `typescript`                                                | `npm run typecheck`.                                                                         |
| `prettier`, `prettier-plugin-astro`                                           | Formatting.                                                                                  |
| `eslint`, `typescript-eslint`, `eslint-plugin-astro`, `@eslint/js`, `globals` | Linting.                                                                                     |
| `yaml`                                                                        | Parsing `tags.yaml` and frontmatter in the validator scripts, which run outside Astro.       |
| `pagefind`                                                                    | Builds a static search index after Astro, so search needs no server or content service.      |

Fonts are **not** a dependency. Source Serif 4 and Inter are committed as
`.woff2` files in `src/assets/fonts/` with their SIL Open Font Licenses, and
registered through Astro's local font provider. There is deliberately no Google
Fonts or Fontsource _provider_: a build-time network fetch is a dependency that
can rot, and this site should still build in 2035.

---

## Things that look wrong but are deliberate

- **`content/writing/_fixture-essay-a.md` is nonsense prose.** It is
  scaffolding, and it is meant to be unmistakably fake. Delete it once there is
  real writing.
- **`content/pages/about.md` is empty and `draft: true`.** Cathal has not
  written it yet, and nobody should write it for him. Because it is a draft, it
  generates no page at all rather than an empty one.
- **CV renders as grey text, not a link.** `/cv` remains in `UNBUILT_ROUTES`
  until Cathal supplies the source CV and Zotero export. Projects, gallery,
  archive, and search have empty-state routes that are safe to link now.
- **`.skip-link` is hand-written CSS, not `sr-only focus:not-sr-only`
  utilities.** The utility version depends on the order Tailwind emits two
  rules in, and it silently stopped working during Stage 1. A skip link that
  fails to appear fails invisibly, so it does not get to depend on emit order.
- **The hero scrim is a solid colour at fixed opacity, not a gradient.** A
  gradient has a different contrast ratio at every pixel and cannot be
  verified. A solid scrim has one worst case — the scrim over pure white — and
  `check:a11y` checks exactly that.
- **`src/assets/hero-placeholder.jpg` is a flat grey-green rectangle.** It is a
  placeholder and it looks like one on purpose.
- **Body links are underlined and the underline is not removable.** Colour
  alone must never be the only signal that something is a link (WCAG 1.4.1).
- **`validate:content` duplicates a check that `src/lib/content.ts` already
  performs.** That is the point: the filter and the audit are independent.
- **`tags.yaml` is empty.** The taxonomy is Cathal's to decide and it is the
  most expensive thing on the site to get wrong, because renaming a tag means
  editing every file that uses it. Stage 2 asks him for it.

---

## Working style

- Small, coherent commits. [Conventional Commits](https://www.conventionalcommits.org/).
- Run `npm run check` before declaring anything done. **If it fails, fix it —
  do not report success.**
- When a decision has a real trade-off, name it and ask rather than choosing
  silently.
- If something in the original specification (`BUILD-PROMPT.md`) turns out to
  be a bad idea once you are in the code, say so rather than implementing it
  badly.

## Build stages

| Stage | Scope                                                                                   | State      |
| ----- | --------------------------------------------------------------------------------------- | ---------- |
| 1     | Foundation: Astro, theme, fonts, layouts, `writing`, RSS, sitemap, validators, CI, docs | Complete   |
| 2     | Projects and taxonomy: `projects`, tags, tag hub, homepage project slots                | Core built |
| 3     | Media: `gallery`, safe ingest script, `media.ts`; lightbox/video ingest later           | Core built |
| 4     | Archive and Pagefind search built; CV, BibTeX rendering and full a11y audit remain      | Partial    |
