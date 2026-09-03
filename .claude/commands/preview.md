---
description: Start the dev server and say what is worth looking at.
---

Start the development server:

```bash
npm run dev
```

It serves on <http://localhost:4321>.

**The dev server shows drafts and fixtures; the production build does not.**
That is deliberate (see `src/lib/content.ts`), and it means the dev server is
not a preview of what the public will see. To check that, run:

```bash
npm run build && npm run preview
```

## Worth looking at

- **`/`** — hero contrast over the image, and whether the About section is
  present. It is omitted entirely while `content/pages/about.md` is a draft.
- **`/writing`** — card spacing, and whether the metadata line reads cleanly.
- **`/writing/_fixture-essay-a`** — the long-form layout. This fixture exists
  precisely to exercise headings, lists, blockquotes, code, tables and
  footnotes in one page. Check the measure (it should cap around 68–72
  characters) and the vertical rhythm between sections.
- **Keyboard only.** Press <kbd>Tab</kbd> from the top of any page. The first
  stop must be a visible "Skip to content" button, and every subsequent stop
  must show an amber focus ring.
- **Narrow viewport.** Resize to about 375px. The navigation wraps rather than
  collapsing into a menu, by design.

If you change anything in `src/styles/`, re-run `npm run check:a11y` — contrast
is a build gate on this site, not a judgement call.
