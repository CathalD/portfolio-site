# How content is organised

Everything you write lives in the `content/` folder at the top of the
repository — deliberately not buried inside the code. Each subfolder is a
"collection": a set of files that share the same shape.

```
content/
  writing/      Essays, technical notes, teaching material, reviews
  pages/        Standalone pages, e.g. About
  projects/     One folder per project            (from Stage 2)
  gallery/      One file per photograph or video  (from Stage 3)
  data/         Shared lists: tags, topics, timeline
  references/   library.bib, exported from Zotero (from Stage 4)
  cv/           cv.yaml                           (from Stage 4)
```

## One entry, one file

A piece of writing is one Markdown file. A project is one folder containing one
`index.md`. There is no arrangement where a single thing is spread across
several files.

That is a decision, not an oversight. Splitting a project into `overview.md`,
`methods.md` and `results.md` looks tidier but forces you to decide which file
a paragraph belongs in _before_ you have written it, and turns "read the whole
project" into an assembly job. A project's sections are just `##` headings, and
the page builds its own contents list from whichever ones exist.

## Frontmatter

Every file starts with a block between two `---` lines. That is frontmatter:
settings that describe the entry, as opposed to the entry itself.

```markdown
---
title: 'Something'
summary: 'One or two sentences.'
draft: true
---

The actual writing starts here.
```

The exact fields each collection allows are defined in
`src/content.config.ts`. That file is the authority — if the documentation and
that file ever disagree, the file is right.

Frontmatter is checked at build time. A missing required field, a date in the
wrong format, or a category that is not on the allowed list stops the build and
names the file and the field. That is much better than a page quietly rendering
without a summary.

## Drafts

Every collection has a `draft` field, and it **defaults to `true`**. Publishing
is something you do on purpose.

- `npm run dev` shows drafts, so you can see work in progress.
- `npm run build` excludes them, so the public site never has them.

The same applies to any file whose name starts with `_fixture-`. Those are
scaffolding — deliberately fake entries that exist so the layouts can be tested
before there is real work to put in them. They are visible locally, never
published, and safe to delete once real content exists.

## Slugs are permanent

The filename becomes the web address:

| File                                       | URL                        |
| ------------------------------------------ | -------------------------- |
| `content/writing/field-notes.md`           | `/writing/field-notes`     |
| `content/pages/about.md`                   | `/about`                   |
| `content/projects/wetland-survey/index.md` | `/projects/wetland-survey` |

**Never rename a file that has been published.** Doing so breaks every link
anyone has ever made to it — bookmarks, citations, emails, other people's
writing — and nothing on your end will warn you.

If a title needs to change, change the `title` field and add the old one to
`formerTitles`. The page then shows "Previously published as …" and the address
stays as it was.

## Nothing is ever deleted

Old work is _archived_, not removed. Archiving means setting `status:
'archived'`, which adds a quiet badge to the entry and groups it under its year
in the archive. The page stays exactly where it was and remains fully readable.

## When it goes wrong

**A file does not appear anywhere.** Check `draft`. Then check the terminal
running `npm run dev` for a frontmatter error naming that file.

**`Content: … is marked draft: true, but it was published`** — a genuine bug in
the code rather than in your writing, and it is exactly what that check exists
to catch. Report it rather than working around it.

**A date is rejected.** Dates are written `2026-03-14` — year, month, day. Not
`14/03/2026`.

**A list field is rejected.** Lists are written `tags: ['one', 'two']`, or as
indented lines each beginning with `-`. A bare word without brackets is not a
list.
