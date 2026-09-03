# Why the site is built this way

This is the reasoning behind the decisions that shape the site. It exists
because a decision without its reason gets undone: someone sees something
unusual, assumes it was an oversight, "fixes" it, and quietly removes the
thing it was protecting against.

`CLAUDE.md` holds the same decisions in a shorter form, aimed at an AI session
about to change something. This page is the longer explanation.

## The site is static

Every page is built into a plain HTML file ahead of time. There is no database,
no server application, no logins, no comment system, no analytics.

A static site cannot be hacked in any interesting way, costs nothing to host,
and — the point — will still work in ten years without maintenance. The
failure mode of a dynamic site left alone for a decade is that it stops
working; the failure mode of a static site is that it looks slightly dated.

The cost is that anything genuinely interactive would need reconsidering. So
far nothing does.

## Content is separate from code

Everything Cathal writes is in `content/`, at the top level of the repository,
in plain Markdown and YAML. None of it is inside the code.

This means the writing outlives the website. If Astro is abandoned in 2031,
`content/` is still a folder of readable text files that any other system can
be pointed at. The code is replaceable; the content is not.

## URLs are permanent

Once a page is published its address never changes. Files are never renamed,
never moved, never deleted.

This is the strongest constraint on the site and the one most likely to be
broken by good intentions. Renaming a file to tidy up a slug feels harmless
because nothing on your own machine breaks. What breaks is every bookmark,
every citation, every link from someone else's page — invisibly, and
permanently.

When a title needs to change, the title changes and the address stays. The old
title goes into `formerTitles` and appears on the page as "Previously published
as …", so the piece stays findable under both names.

`npm run check:links` verifies that nothing on the site links to a page that
does not exist. It cannot check the links other people have made, which is why
the rule has to be absolute rather than checked.

## Archiving is a status, not a move

The obvious way to handle old work is a folder called `archive/`. That would
change the address of everything moved into it, which breaks the rule above.

Instead, `/archive` is a _view_: it reads all the existing collections, merges
them with the milestones in `timeline.yaml`, and groups everything by year.
Archiving something means setting `status: 'archived'` on it. The entry keeps
its address, stays fully readable, and gains a quiet badge.

This also makes "show me everything from 2021" answerable, which the folder
version does not.

## One file per entry

A project is a single `index.md` with `##` headings, not a folder of separate
section files.

Splitting a project across files means deciding which file a paragraph belongs
in before writing it, and turns reading the whole thing into an assembly job.
One file is one thought. The contents sidebar is built from whichever headings
happen to exist, so a project with three sections and a project with nine both
work without configuration.

## Citations come from Zotero, never from typing

`content/references/library.bib` is exported from Zotero. Content refers to
entries by key, and the build fails if a key does not exist in that file.

A hand-typed citation is a fabrication risk. A citation that is _almost_ right
— wrong year, wrong journal, wrong initials — is worse than a missing one,
because it looks checked. Making the `.bib` the single source of truth means
there is exactly one place a citation can be wrong, and it is the place that is
already curated.

## Colour lives in one file

Every colour on the site is a named token in `src/styles/theme.css`, and no
other file is allowed to contain a hex value. `npm run check:a11y` enforces
this by searching the codebase and failing the build on a stray one.

Two reasons. Changing the palette is one edit rather than a search across
dozens of files. And more importantly, the contrast checker can only verify
colours it can find — a colour written directly into a component is a colour
nobody is checking.

Tokens are named for what they are _for_ (`--color-ink-muted`) rather than what
they look like (`--color-grey-600`), so that a redesign changes values rather
than names.

## Accessibility is checked, not intended

The site targets WCAG 2.1 AA, and `npm run check:a11y` verifies every
foreground-on-background combination the site actually uses. If a colour change
drops a combination below the threshold, the build fails.

"We aim for accessibility" reliably degrades. A failing build does not.

The same thinking applies elsewhere: alt text is a required field in the
gallery schema rather than a reminder, and the skip link is written in plain
CSS rather than utility classes because it once stopped working silently and a
skip link that fails to appear fails invisibly.

## There is no dark mode

The design is a field notebook — warm paper, deep ink, subtle greens. A dark
inversion is a different design, not a variant, and maintaining two means
verifying every contrast pair twice, forever.

Colours still go through custom properties in one file, which is good practice
regardless of how many themes exist. Adding a second theme later is possible;
it is a design decision, not a small addition.

## Photograph locations are stripped by default

Cameras record GPS coordinates in every photograph. The ingest script removes
them unless a file is explicitly listed in `scripts/geo-allowlist.txt`, which
is itself not stored in the repository.

Publishing the coordinates of a nest, a den, or a rare plant population can get
that population disturbed or poached. Opt-out would eventually fail; opt-in
fails safe.

## Reading time is computed, never stored

It is calculated from the text at build time and is deliberately not a
frontmatter field. A stored reading time is wrong the first time a post is
edited, and nobody remembers to update it.

It is calculated from the raw Markdown rather than through the Markdown
processor, so it does not depend on which engine Astro ships. That engine
already changed once, in Astro 7, during Stage 1 of this build.

## Drafts are filtered in exactly one place, and audited in another

Every page reads content through `getPublished()` in `src/lib/content.ts`. No
page reads a collection directly. That single chokepoint is what makes "a draft
never reaches production" a guarantee rather than a habit.

`npm run validate:content` then re-checks the built output independently and
fails if anything unfinished got through. Checking the same rule twice, in two
different ways, is the point: a bug in the filter is caught rather than
shipped.

## Dependencies are kept few, and each is justified

Every package in `package.json` has a one-line reason in `CLAUDE.md`. Fonts are
committed files rather than a package, and there is no webfont CDN — a
build-time network fetch is a dependency that can rot.

Each dependency is a thing that can break, be abandoned, or need migrating, at
a time when nobody is paying attention. Over ten years that cost compounds.
