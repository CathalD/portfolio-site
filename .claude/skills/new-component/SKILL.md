---
name: new-component
description: Scaffold a new Astro component to this repository's house conventions and register it in the documentation. Use when adding any component to src/components/.
---

# new-component

Creates a component in `src/components/` that matches everything else in this
repository.

## When this applies

Any time a new `.astro` component is added. Prefer extending an existing
component or layout to adding a new one — `CLAUDE.md` says "no duplicated
layout logic", and a fourth card component that is 90% the same as the other
three is how that rot starts.

## Before writing anything

Ask two questions:

1. **Does this already exist?** Check `src/components/` and `src/layouts/`.
2. **Should this be a layout instead?** If it wraps a whole page, it belongs in
   `src/layouts/` and should compose `BaseLayout`.

## The house shape

Every component looks like this:

```astro
---
/*
 * ComponentName — one line saying what it is.
 *
 * Used by: the specific pages or components that render it. Keep this
 * accurate; it is how a future session knows what breaks if this changes.
 *
 * Anything non-obvious about the markup — an accessibility decision, a
 * workaround, a deliberate omission — is explained here rather than left to be
 * rediscovered.
 */

interface Props {
  /** What this prop is for. Every prop gets a comment. */
  someProp: string;
  /** Optional props say what happens when they are absent. */
  optional?: string;
}

const { someProp, optional } = Astro.props;
---

<!-- markup -->
```

## Rules this repository enforces

- **No hex values.** Colour comes from the tokens in `src/styles/theme.css`,
  via Tailwind utilities (`text-ink`, `bg-surface`, `border-rule`) or
  `var(--color-…)`. `npm run check:a11y` fails the build on a stray hex.
- **New colour pair? Add it to `check:a11y`.** If the component puts a
  foreground on a background that is not already in the `PAIRS` list in
  `scripts/check-a11y.ts`, add it. An unlisted pair is an unverified pair.
- **Sharp edges.** `rounded-none` or `var(--radius)` (2px). Nothing rounder.
- **Hairline borders over shadows.**
- **Transitions only on hover and focus**, under 200ms, using
  `var(--transition)`.
- **No scroll-triggered animation. No gradients. No dark mode variants.**
- **Semantic HTML.** A clickable thing is a `<button>` or an `<a>`, never a
  `<div>` with a click handler.
- **Never remove a focus ring.**
- **Images require meaningful `alt`.** If the alt text is not obvious from the
  props, make it a required prop rather than defaulting it to `""`.
- **Do not wrap a whole card in one `<a>`.** It makes the accessible name the
  entire card contents and stops text being selectable. Link the heading and
  extend the hit area with `after:absolute after:inset-0` — `WritingCard.astro`
  is the reference implementation.

## After writing it

1. Add it to the component list in `docs/creating-components.md`.
2. If it introduces a new colour combination, add the pair to
   `scripts/check-a11y.ts`.
3. Run `npm run check`.
4. Look at it on the dev server, including with the keyboard.

## Never

- Invent copy for the component. Placeholder strings inside a component are
  content. Take them as props, or add a `TODO(cathal):` and ask.
