# Adding a project

> **Not built yet.** Projects arrive in **Stage 2**. This page describes what
> is planned so the shape is on record; it is not yet something you can follow.
> Until then, `content/projects/` does not exist and `/projects` is shown in
> the navigation as plain text rather than a link.

## What a project will be

One folder, one file: `content/projects/[slug]/index.md`.

The folder name becomes the address — `/projects/[slug]` — and it is permanent.
Sections of the project are `##` headings inside that one file, and the page
builds its own contents sidebar from whichever headings exist. The conventional
headings are Overview, Planning, Build, Results, Reflection, Equipment, Code,
Budget, Maps and Videos, and every one of them is optional.

There is deliberately no arrangement where a project is split across several
files. See [architecture-decisions.md](architecture-decisions.md).

## The settings it will take

`title`, `summary`, `status` (`taking-off`, `in-progress`, `completed` or
`archived`), `year`, an optional `endYear` and `duration`, `tags`, an optional
`featured` flag for the home page, a hero image with required alt text, links
to related projects and writing, downloadable files, citation keys, and the
usual `draft` flag.

The authoritative definition will be in `src/content.config.ts` once the
collection exists.

## How you will use it

Ask Claude: _"add a project"_, and point it at your notes or a folder. The
`add-project` skill will build the frontmatter, check your tags against
`tags.yaml`, wire up related content, and ask you about anything missing.

It will not write the project description. Nothing on this site is written for
you — see the content rule in `CLAUDE.md`.

## What happens in Stage 2

Building this needs one thing from you first: **the tag list**.
`content/data/tags.yaml` is currently empty, on purpose. Tags are the most
expensive thing on the site to get wrong later, because renaming one means
editing every file that uses it, so nothing has been guessed at.
[taxonomy.md](taxonomy.md) explains how to think about it.
