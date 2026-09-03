# Publishing something you have written

A piece of writing is one Markdown file in `content/writing/`. The filename
becomes the web address, and everything else is set in a small block of
settings at the top of the file.

## The short version

Ask Claude: _"publish this"_, and point it at your document. The
`publish-writing` skill converts the file, works out the settings, finds
anything that looks like a citation and asks you about it, and leaves the piece
as a draft for you to check.

The rest of this page explains what it is doing, so that you can do it yourself
or tell when it has got something wrong.

## Doing it by hand

Create a file at `content/writing/some-title.md`. The name of that file is
permanent — it becomes `cathaldoherty.ca/writing/some-title` — so choose it
deliberately. Short, lower case, words separated by hyphens.

The file starts with a block between two `---` lines. This is the frontmatter:
settings, not content.

```markdown
---
title: 'The title as it should appear'
summary: 'One or two sentences. Shown on the index page and used by search engines.'
category: 'essay'
tags: []
publishedAt: 2026-03-14
draft: true
---

Your first paragraph starts here.

## A section heading

More writing.
```

Then write below it, in Markdown: `##` for a heading, `*italics*`,
`**bold**`, `[link text](https://example.com)`, `-` for bullets.

## The settings, explained

**`title`** — as it should appear on the page.

**`summary`** — one or two sentences. This shows on the writing index, and it
is what Google displays under the link. Worth writing carefully.

**`category`** — one of exactly these six: `essay`, `technical`, `teaching`,
`research`, `idea`, `review`. Anything else stops the build.

**`tags`** — a list, like `['coastal-ecology', 'field-methods']`. **Every tag
must already exist in `content/data/tags.yaml`.** If it does not, the build
fails on purpose. See [taxonomy.md](taxonomy.md) for why.

**`publishedAt`** — the date, written `2026-03-14`.

**`updatedAt`** — only if you are revising something already published.

**`draft`** — `true` means it is not published. Set it to `false` when you are
ready. It defaults to `true`, so nothing goes out by accident.

**`references`** — a list of citation keys from your Zotero export. Only use
keys that exist in `content/references/library.bib`. **Never type a citation by
hand.**

**`substackUrl`** — if a copy also appears on Substack. This site is always the
canonical version; that setting just adds a link out.

**`formerTitles`** — if you rename a piece, put the old title here. Do not
rename the file.

You do **not** set the reading time. It is calculated from the text every time
the site builds, so it can never be out of date.

## Checking it

With `npm run dev` running, open
<http://localhost:4321/writing/your-file-name>. Because it is a draft, it shows
locally but not on the real site.

When you are happy, set `draft: false`, run `npm run check`, and push.

## When it goes wrong

**The page does not appear at all.** Almost always a frontmatter problem. Look
at the terminal running `npm run dev` — it will name the field. The usual
causes are a missing `summary`, a `category` that is not one of the six, or a
date written as `14/03/2026` instead of `2026-03-14`.

**`Tags: "something" is used by … but is not in content/data/tags.yaml`** —
you used a tag that does not exist yet. Either change it to an existing one, or
add it to `tags.yaml` first. Read [taxonomy.md](taxonomy.md) before adding one;
tags are cheap to create and expensive to rename.

**`References: "key" is cited by … but is not in library.bib`** — the citation
key does not match the Zotero export. Re-export the library from Zotero rather
than editing the `.bib` file.

**Apostrophes and quotation marks look wrong.** If the text came out of Word,
it may contain characters that confuse the frontmatter. Wrapping a value in
single quotes — `title: 'It''s here'` — usually fixes it; note the doubled
apostrophe.

**It published when you did not mean it to.** Set `draft: true` and push. The
page disappears on the next build. Nothing is deleted; the file stays where it
is.
