# Adding a component

A component is a reusable piece of a page — a card, a badge, a gallery, the
navigation. This page is mostly for AI sessions; the `new-component` skill in
`.claude/skills/` is the short version.

## Before adding one

Two questions, in order:

1. **Does it already exist?** Look in `src/components/` and `src/layouts/`.
2. **Should it be a layout?** Anything that wraps a whole page belongs in
   `src/layouts/` and must compose `BaseLayout`.

Prefer extending something over adding something. A fourth card component that
is ninety per cent the same as the other three is how a codebase becomes
unmaintainable, and it happens one reasonable-seeming addition at a time.

## The shape every component has

```astro
---
/*
 * ComponentName — one line saying what it is.
 *
 * Used by: the specific pages that render it. Keep this accurate; it is how
 * a future session knows what breaks if this changes.
 *
 * Anything non-obvious — an accessibility decision, a workaround, a
 * deliberate omission — is explained here rather than left to be
 * rediscovered.
 */

interface Props {
  /** Every prop gets a comment. */
  someProp: string;
  /** Optional props say what happens when they are absent. */
  optional?: string;
}

const { someProp, optional } = Astro.props;
---

<!-- markup -->
```

The header comment is not decoration. In ten years it is the only thing that
explains why a component looks the way it does.

## Rules

- **No hex values.** Colour comes from tokens in `src/styles/theme.css`, via
  Tailwind utilities (`text-ink`, `bg-surface`, `border-rule`) or
  `var(--color-…)`. The build fails on a stray hex.
- **New colour combination? Add it to `scripts/check-a11y.ts`.** If the
  component puts a foreground on a background not already in that file's
  `PAIRS` list, add it. An unlisted pair is an unverified pair.
- **Sharp edges.** `rounded-none`, or `var(--radius)` for 2px. Nothing more.
- **Hairline borders rather than shadows.**
- **Transitions on hover and focus only**, under 200ms, using
  `var(--transition)`. No scroll-triggered animation.
- **No gradients, no dark-mode variants.**
- **Semantic HTML.** A clickable thing is a `<button>` or an `<a>`, never a
  `<div>`.
- **Never remove a focus ring.**
- **Images need meaningful `alt`.** If it cannot be derived from the props,
  make it a required prop rather than defaulting it to empty.

## Two patterns worth copying

**Card links.** Do not wrap an entire card in one `<a>`. It makes the
accessible name the whole card contents, which is unusable with a screen
reader, and it stops the summary text being selectable. Link the heading, and
extend the clickable area with `after:absolute after:inset-0` on a `relative`
parent. `WritingCard.astro` is the reference.

**Styling Markdown.** Astro's scoped styles do not reach content rendered
through `<Content />`, because that HTML never carries the component's scoping
attribute. `Prose.astro` uses `<style is:global>` namespaced under `.prose`
instead. Follow that pattern rather than fighting the scoping.

## Where things live

| Folder            | What belongs there                                           |
| ----------------- | ------------------------------------------------------------ |
| `src/components/` | Reusable pieces of page                                      |
| `src/layouts/`    | Page shells: `BaseLayout`, `ProseLayout`, `CollectionLayout` |
| `src/lib/`        | Logic with no markup                                         |
| `src/pages/`      | One file per URL, and nothing else                           |

Pages should be thin. If a page file is getting long, the length usually
belongs in a component.

## Existing components

| Component                                                                           | Purpose                                          | Stage |
| ----------------------------------------------------------------------------------- | ------------------------------------------------ | ----- |
| `BaseHead`                                                                          | Everything in `<head>`: meta, Open Graph, fonts  | 1     |
| `Nav`                                                                               | Primary navigation                               | 1     |
| `Footer`                                                                            | Site footer                                      | 1     |
| `Hero`                                                                              | Full-bleed home page header with scrim           | 1     |
| `Prose`                                                                             | Typographic styling for rendered Markdown        | 1     |
| `Metadata`                                                                          | The small line of dates and labels under a title | 1     |
| `WritingCard`                                                                       | One entry in the writing index                   | 1     |
| `ProjectCard`, `Tag`, `StatusBadge`, `TableOfContents`                              |                                                  | 2     |
| `GalleryCard`, `ImageGallery`, `Lightbox`, `VideoEmbed`                             |                                                  | 3     |
| `Timeline`, `TimelineEntry`, `ReferenceList`, `DownloadCard`, `Pagination`, `Quote` |                                                  | 4     |

Add a row here when you add a component.

## After writing it

1. Add it to the table above.
2. Add any new colour pair to `scripts/check-a11y.ts`.
3. `npm run check`.
4. Look at it in a browser, including with the keyboard only.

## Never

Invent copy for a component. A placeholder string inside a component is
content. Take it as a prop, or leave a `TODO(cathal):` and ask.
