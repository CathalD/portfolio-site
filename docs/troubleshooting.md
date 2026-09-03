# When something is broken

Almost every failure on this site is one of the checks doing its job. The
messages are written to tell you what to do, so read them before assuming
something is deeply wrong.

Start here:

```bash
npm run check
```

## Reading the output

`npm run check` runs nine things in order and stops at the first failure. The
name of the failing step tells you which section below to read.

---

## `validate:tags` failed

**`"x" is used by content/writing/y.md but is not in content/data/tags.yaml`**

You used a tag that does not exist in the canonical list. Either correct the
spelling in the content file, or add the tag to `content/data/tags.yaml`.
Read [taxonomy.md](taxonomy.md) first — this failure exists to stop the tag
list fragmenting, so the right fix is usually to use an existing tag.

If the message says _"Did you mean …?"_, it found something similar. That is
usually the answer.

---

## `validate:refs` failed

**`"key" is cited by … but is not in content/references/library.bib`**

A citation key in some frontmatter does not exist in the Zotero export.

**Do not fix this by editing `library.bib`.** That file is generated. Fix the
entry in Zotero, re-export the library over the top of the file, and run the
check again. If the citation is genuinely not in your Zotero library yet, add
it there first.

This check is the reason a fabricated citation cannot reach the site.

---

## `typecheck` failed

This is a code problem, not a content problem. The message names a file and a
line. Ask Claude to fix it — it is not something to work around by deleting
the check.

---

## `lint` or `format:check` failed

Formatting. Fix it automatically:

```bash
npm run format
```

Then run `npm run check` again.

---

## `build` failed

**A message naming a content file and a field** — frontmatter is wrong in that
file. The usual causes: a missing `summary`, a `category` outside the allowed
list, a date written the wrong way round, or a value containing an apostrophe
that needs quoting.

**`heroAlt is required when heroImage is set`** — you added an image without
describing it. Add `heroAlt` saying what the image shows. Do not repeat the
title; describe the picture.

**Something about a module, or a red wall of unfamiliar text** — usually a
broken install rather than anything you did:

```bash
rm -rf node_modules .astro
npm install
npm run check
```

That fixes most mysterious failures.

---

## `validate:content` failed

**`… is marked draft: true, but it was published`** — a bug in the site's
code, not in your writing. This check exists precisely to catch that. Report
it; do not work around it.

**`… contains a TODO(cathal) marker`** — a note asking you a question has ended
up on a public page. Find it, answer it, and remove the marker. If you want to
keep the note for later, move it into the frontmatter as a `#` comment, where
it will never be rendered.

**`… contains the string "_fixture-"`** — scaffolding has leaked into the real
site. Report it.

**`relatedProjects refers to "x", but there is no content/projects/x`** — a
cross-reference points at something that does not exist. Either the slug is
mistyped, or it refers to work not written yet.

---

## `check:links` failed

**`… links to "/some/path", which does not exist in the build`**

Something on the site links to a page that is not there. The two usual causes:

1. A file in `content/` was renamed. **Rename it back.** URLs on this site are
   permanent; changing a filename breaks every existing link to it. If a title
   needs to change, change `title` and add the old one to `formerTitles`.
2. The link points at a page that has not been written yet, or is still a
   draft. Drafts do not exist in the built site.

**`… but that page has no id="something"`** — a link to a specific heading, and
that heading has been renamed or removed.

---

## `check:a11y` failed

**`FAIL 3.20:1 (needs 4.5:1) …`**

A colour combination is not readable enough to meet the accessibility
standard. The message names the two colour tokens and where they are used.
Adjust the value in `src/styles/theme.css` — darken a foreground, lighten a
background — and run the check again until it passes.

Do not lower the threshold. It is the legal accessibility standard, not a
preference.

**`Hex values found outside src/styles/theme.css`**

A colour was written directly into a component. Move it into
`src/styles/theme.css` as a named token and refer to that instead. Every colour
on the site lives in one file so that changing the palette is one edit, and so
that the contrast checker can see every colour that exists.

---

## The site builds locally but the deployment fails

Check that everything is actually committed and pushed — a file that exists
only on your laptop will build locally and fail on Vercel:

```bash
git status
```

If it is genuinely committed, open the failed deployment in Vercel and read
the log; it is the same output as `npm run build`.

---

## A published page has disappeared

This should be impossible, and it is worth treating as serious.

The likely cause is that a file in `content/` was renamed, deleted, or set
back to `draft: true`. Check the history:

```bash
git log --diff-filter=D --name-only -- content/
```

Restore the file under its original name. Nothing on this site is ever deleted
or moved — see "The permanent URL contract" in `CLAUDE.md`.

---

## Nothing here matches

Copy the entire error message — all of it, not a summary — and give it to
Claude along with what you were doing. The messages in this repository are
written to be actionable, so the full text is usually enough to work from.
