# Adding photographs and video

> **Not built yet.** The gallery and its ingest script arrive in **Stage 3**.
> This page records the plan — particularly the location-privacy rule, which is
> the part that matters most — but it is not yet something you can follow.

## How it will work

Full-resolution originals stay **outside** this repository. Only web-sized
versions are committed; a decade of raw files would make the repository
unusable.

The process will be:

1. Drop photographs into `content/gallery/_inbox/`. That folder is ignored by
   git, so nothing in it is ever committed by accident.
2. Run `npm run ingest`.
3. The script reads the EXIF data, generates AVIF and WebP versions at four
   sizes, writes them to `public/images/gallery/[slug]/`, and creates a
   Markdown file with the camera settings already filled in.
4. It leaves `TODO(cathal):` markers on the things only you can supply: the alt
   text, the caption, the species, and which project it belongs to.
5. You fill those in — or ask Claude to walk you through them with the
   `add-gallery-items` skill.

The originals are never modified and never deleted.

## Location data — the important part

**GPS coordinates are stripped from every photograph by default.**

Cameras and phones record the exact location of every shot. Publishing the
coordinates of a nest, a den, or a rare plant population can get that
population disturbed, collected or poached. This is not a hypothetical risk in
conservation work.

Coordinates are only ever published if a file is listed explicitly in
`scripts/geo-allowlist.txt` — a file that is itself not stored in the
repository, so the decision is deliberate, per-photograph, and made on your own
machine.

The default is silence. If you are unsure about a location, leave it out. A
coarse, human-readable `location` field ("Georgian Bay", "eastern Ontario") is
available and is almost always the right level of detail for a public site.

## Alt text is required

The gallery schema makes `alt` a **required** field. A photograph without a
description is inaccessible to anyone using a screen reader, and it is
invisible to search.

Describe what the picture actually shows. Do not repeat the title, and do not
write "photograph of" — that is already known.

## What you will need to decide in Stage 3

- Where the full-resolution originals live, so the documentation can point at
  it.
- Whether video is hosted elsewhere and embedded, or committed here. Video
  files are large and this repository should stay small.
