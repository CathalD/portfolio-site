## What changed

<!-- One or two sentences. If this is a content change, say what was added or
     updated rather than which files moved. -->

---

## Content review checklist

**The maintainer of this site reviews content, not code.** The automated
checks in CI cover the code; this list covers the things a machine cannot
verify. Tick every box, or say why it does not apply.

- [ ] **Facts verified.** Every factual claim in this change is one I can
      stand behind. Nothing has been paraphrased into something I did not mean.
- [ ] **Citations are real.** Every reference key exists in
      `content/references/library.bib` and was exported from Zotero, not typed
      by hand. No citation was written from memory.
- [ ] **Species, places and dates are correct.** Nothing has been guessed at or
      filled in as a plausible-looking placeholder.
- [ ] **Alt text present and meaningful.** Every image describes what it
      actually shows, and does not simply repeat the caption or the title.
- [ ] **No `TODO(cathal)` remaining** in anything being published.
      (`npm run validate:content` fails the build if one reaches the HTML, but
      a marker sitting in a draft is worth resolving too.)
- [ ] **GPS decision made.** For every photograph added: coordinates are
      stripped (the default), or the file is on `scripts/geo-allowlist.txt`
      because publishing its location is safe. **Sensitive species locations
      must never be published.**
- [ ] **Slugs unchanged.** No existing file was renamed. If a title changed,
      the old one was added to `formerTitles` instead.
- [ ] **Tags are canonical.** Any new tag was added to
      `content/data/tags.yaml` first.

## Code review checklist

- [ ] `npm run check` passes locally.
- [ ] No hex colour outside `src/styles/theme.css`.
- [ ] Any new dependency is justified in the table in `CLAUDE.md`.
- [ ] New components have a header comment and a typed `Props` interface.
