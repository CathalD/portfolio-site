# Tags and topics

Tags are how work on this site connects to other work on it. A tag hub at
`/tags/[tag]` gathers every project, essay and photograph that carries a
given tag, which over ten years is the difference between an archive and a
pile.

## The rule

**A tag can only be used in content if it is listed in
`content/data/tags.yaml`.** If you use one that is not, the build fails.

That is deliberate friction, and it is the most useful constraint on this
site.

## Why the build fails instead of just accepting the tag

Because without it, this happens — slowly, over years, without anyone
noticing:

```
eelgrass       7 entries
Eelgrass       3 entries
seagrass       4 entries
sea-grass      1 entry
```

Four tags, fifteen entries, and no page that shows you all fifteen. Nobody
ever decides to do this; it happens one small inconsistency at a time, and by
the time it is obvious it is a large tidying job across dozens of files.

Making the build stop means the decision — "is this a new tag, or an existing
one spelled differently?" — gets made once, at the moment of writing, when you
still remember.

## Adding a tag

Open `content/data/tags.yaml` and add an entry:

```yaml
tags:
  - slug: coastal-ecology
    label: Coastal ecology
    description: Work on nearshore and intertidal systems.
    group: research-areas
```

- **`slug`** is what goes in frontmatter and in the URL. Lower case, hyphens,
  no spaces. **It never changes** — renaming it means editing every file that
  uses it.
- **`label`** is how it displays. This _can_ change freely.
- **`description`** is optional, shown at the top of the tag's page.
- **`group`** is optional, from `topics.yaml`, used to group tags in the
  interface.

## Choosing tags well

Tags are for **finding things later**, not for describing things now. Before
adding one, ask: _in three years, would I go looking for everything tagged
this?_ If the honest answer is no, it is a word from the summary, not a tag.

Some things that help:

- Prefer few, broad, durable tags over many precise ones. Five entries under
  one tag is useful; one entry each under five tags is not.
- Pick one level of specificity and stay there. Mixing `ecology` and
  `eelgrass-transect-methodology` makes both less useful.
- Use the singular or the plural consistently. This repository uses whichever
  reads naturally, but never both for the same idea.
- A tag with only one entry is not yet earning its place. That is fine while
  the site is young — just be aware of it.

## Topics

`content/data/topics.yaml` groups tags into higher-level areas, so that a tag
list of forty items can be displayed as five groups. It is presentational: a
tag works perfectly well without a group.

## The current state

`tags.yaml` is currently **empty**, and that is intentional. The taxonomy is
yours to decide, and it is the single most expensive thing on this site to get
wrong later. Nothing has been guessed at on your behalf.

## When it goes wrong

**`Tags: "x" is used by content/writing/y.md but is not in tags.yaml`** — the
message names the file and the tag. Either fix the spelling in the content, or
add the tag to `tags.yaml`.

**`"x" is not lower-case kebab-case`** — the slug has a capital letter, a
space, or an underscore. Slugs appear in URLs, so they are restricted to
lower-case letters, digits and hyphens.

**`tags.yaml defines "x" more than once`** — a duplicate entry. Delete one.

**`Tags: defined but not yet used — x, y`** — not an error. Those tags exist
but nothing carries them, so their pages will be empty. Harmless, but worth
noticing if it was not intentional.

**You want to rename a tag.** Changing the `label` is free — do that. Changing
the `slug` breaks the tag's URL and requires editing every file that uses it.
Ask Claude to do it in one pass rather than by hand, and expect it to be a
real change rather than a tidy-up.
