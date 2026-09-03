# Updating the CV

> **Not built yet.** The CV page arrives in **Stage 4**. This page records the
> plan. Until then, `/cv` appears in the navigation as plain text rather than a
> link.

## How it will work

The CV will be **structured data, not prose**: a file at `content/cv/cv.yaml`
with separate sections for education, positions, teaching, service, skills and
awards.

That is deliberate. A CV written as a Markdown document is one long block of
text that has to be reformatted by hand every time something is added, and it
cannot be reused anywhere else. Structured data can be rendered as a web page,
exported as a PDF, and reordered without retyping.

## Publications will come from Zotero

Publications will **not** be typed into `cv.yaml`. They will be generated from
`content/references/library.bib`, exported from your Zotero library, and
rendered in a consistent citation style.

This means:

- Your publication list on the site is always exactly what is in Zotero.
- The same source supplies the reference lists at the bottom of projects and
  essays, so a paper is described identically everywhere it appears.
- A citation cannot be subtly wrong in one place and right in another.

**Never edit `library.bib` by hand.** Fix it in Zotero and re-export over the
top of the file. If a citation key used in content is missing from the export,
the build fails — that check is what makes fabricating a citation impossible
rather than merely discouraged.

## How you will use it

Ask Claude: _"update my CV"_, and hand it the new version. The `update-cv`
skill will update `cv.yaml`, prompt you to re-export the `.bib` from Zotero,
and regenerate the PDF.

## What will be needed in Stage 4

- Your Zotero library exported to `content/references/library.bib`.
- Your current CV, in whatever format it exists in.
- A decision on citation style — whichever your field uses.
