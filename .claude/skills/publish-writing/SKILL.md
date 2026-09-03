---
name: publish-writing
description: Turn a draft in content/writing/_inbox/ — a .docx, .pages export, or markdown — into a published piece of writing with correct frontmatter. Use when Cathal says he has written something, wants to publish an essay or a post, or points at a file in the writing inbox.
---

# publish-writing

Converts a finished piece of writing into an entry in the `writing` collection.

## When this applies

- Cathal has dropped a file into `content/writing/_inbox/`
- He says "I've written something", "publish this essay", "add this post"
- He hands over a `.docx`, a Pages export, a Google Docs export, or Markdown

## The rule that governs this whole skill

**Preserve the author's words exactly.**

You are converting a format, deriving metadata, and asking questions. You are
not editing. Do not rewrite sentences, do not "tighten" prose, do not fix what
looks like a stylistic choice, do not restructure paragraphs. If something
genuinely looks like a typo, **list it at the end and ask** — do not silently
correct it. He is a scientist; his phrasing is deliberate more often than not.

And never write the piece, or any part of it. See "THE CONTENT RULE" in
`CLAUDE.md`.

## Steps

### 1. Convert to Markdown

For `.docx`, use `pandoc` if it is available (`pandoc -f docx -t markdown
--wrap=none`). If it is not, say so and ask before installing anything.

Then clean up **structure only**:

- Word's smart quotes and em dashes are fine — keep them.
- Convert Word's heading styles to `##` / `###`. The title becomes frontmatter,
  not an `#` in the body.
- Footnotes become Markdown footnotes.
- Images: extract them, and **stop** — ask where each belongs and what its alt
  text should be. Do not invent alt text.
- Delete Word's empty paragraphs and stray `\` line breaks.

### 2. Choose the slug

The filename becomes the permanent URL: `content/writing/[slug].md` →
`/writing/[slug]`. Lower-case kebab-case, derived from the title, short.

**Confirm the slug with Cathal before writing the file.** It can never change
afterwards. See "The permanent URL contract" in `CLAUDE.md`.

### 3. Build the frontmatter

The schema is in `src/content.config.ts` and it is authoritative. Fields:

| Field         | How to fill it                                                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | From the document.                                                                                                                                                                           |
| `summary`     | **Ask.** 1–2 sentences, used on cards and as the meta description. Do not write it for him — offer to, only if he asks.                                                                      |
| `category`    | `essay`, `technical`, `teaching`, `research`, `idea` or `review`. Propose one, confirm it.                                                                                                   |
| `tags`        | **Must already exist in `content/data/tags.yaml`.** Propose tags from that file. If none fit, ask whether to add a new one — adding a tag is a taxonomy decision, not a formatting decision. |
| `publishedAt` | Ask. Do not default to today without checking.                                                                                                                                               |
| `updatedAt`   | Only if this is a revision of something already published.                                                                                                                                   |
| `references`  | See step 4.                                                                                                                                                                                  |
| `substackUrl` | Only if a copy is posted there. It is an **outbound link**; the canonical URL is always this site.                                                                                           |
| `draft`       | Leave `true` until he says publish.                                                                                                                                                          |

There is **no `readingTime` field** — it is computed at build time. Do not add
one.

### 4. Flag anything that looks like a citation

Scan the text for author-year patterns, journal names, DOIs, quoted findings,
"as shown by", and similar. For each one found:

- **Do not create a BibTeX entry.** Not even a stub, not even a plausible one.
- List it and ask for the DOI or the Zotero key.
- Once he supplies keys, add them to `references:` in frontmatter. The `.bib`
  itself is re-exported from Zotero — never hand-edited.

`npm run validate:refs` fails the build on a key that is not in the `.bib`, so
a guess here becomes a broken build, not a silent fabrication. That is the
intended behaviour.

### 5. Write the file and check it

```bash
npm run check
```

Then look at the rendered page at `/writing/[slug]` on the dev server before
saying it is done — conversion artefacts are much easier to see rendered than
in Markdown.

### 6. Report back

Tell him:

- the URL the piece will publish at
- the reading time that was computed
- every citation found and what is still needed for it
- anything that looked like a typo, quoted, unchanged, for him to rule on
- that it is still `draft: true`, and what to say to publish it

## Never

- Rewrite, condense or "improve" his prose
- Invent a summary, a tag, an alt text or a citation
- Change a slug on an already-published piece
- Set `draft: false` without being told to
