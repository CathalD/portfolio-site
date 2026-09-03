---
description: Run the full quality gate — build, typecheck, lint, and every validator.
---

Run the complete check suite for this site and report the result.

```bash
npm run check
```

This runs, in order:

1. `validate:tags` — every tag in content exists in `content/data/tags.yaml`
2. `validate:refs` — every citation key exists in `content/references/library.bib`
3. `typecheck` — `astro check`
4. `lint` — ESLint
5. `format:check` — Prettier
6. `build` — the production build
7. `validate:content` — no draft, fixture or `TODO(cathal)` reached `dist/`
8. `check:links` — every internal link in `dist/` resolves
9. `check:a11y` — contrast ratios meet WCAG AA, and no hex outside `theme.css`

Steps 7 and 8 read `dist/`, so they must run after the build. That ordering is
already baked into the `check` script.

**If anything fails, fix it. Do not report success on a failing check, and do
not weaken a check to make it pass.** Each of these exists because of a
specific failure mode described in `CLAUDE.md`; if one seems wrong, say so and
ask rather than deleting it.

When reporting back, say which step failed and what the message was, not just
that the build is red.
