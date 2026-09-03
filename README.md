# cathaldoherty.ca

The personal website and long-term work archive of Cathal Doherty,
conservation biologist.

This repository holds both the site's code and its content. It is built with
[Astro](https://astro.build), deployed on [Vercel](https://vercel.com), and
designed to be maintained for a decade — mostly through AI assistance rather
than by a web developer.

## If you are an AI session working on this repository

Read **[`CLAUDE.md`](CLAUDE.md)** first, all of it. It contains the
architecture decisions and the reasons behind them, the permanent URL
contract, and the rule about never inventing content. Most of what looks
odd here is deliberate, and the reasons are in that file rather than in the
code.

## If you are Cathal

Everything you need is in **[`docs/`](docs/)**, written in plain prose:

| I want to…                        | Read                                                        |
| --------------------------------- | ----------------------------------------------------------- |
| Get the site running on my laptop | [running-locally.md](docs/running-locally.md)               |
| Publish something I have written  | [adding-a-blog-post.md](docs/adding-a-blog-post.md)         |
| Add a project                     | [adding-a-project.md](docs/adding-a-project.md)             |
| Add photographs                   | [adding-gallery-items.md](docs/adding-gallery-items.md)     |
| Update my CV                      | [updating-the-cv.md](docs/updating-the-cv.md)               |
| Understand how tags work          | [taxonomy.md](docs/taxonomy.md)                             |
| Understand the content files      | [content-collections.md](docs/content-collections.md)       |
| Get the site online               | [deploying.md](docs/deploying.md)                           |
| Fix something that is broken      | [troubleshooting.md](docs/troubleshooting.md)               |
| Know why it was built this way    | [architecture-decisions.md](docs/architecture-decisions.md) |

## Quickstart

You need [Node.js](https://nodejs.org) 22 or newer. The exact version is
pinned in `.nvmrc`.

```bash
npm install
npm run dev
```

The site is then at <http://localhost:4321>. Changes to files in `content/`
appear in the browser immediately.

Before pushing anything:

```bash
npm run check
```

That runs the build, the typechecker, the linter and five validators. If it
passes, the site is safe to publish. If it fails, it tells you what to fix —
see [troubleshooting.md](docs/troubleshooting.md).

## The one rule

**Nothing on this site is ever written by an AI, and no citation is ever
typed by hand.** Placeholder text that sounds plausible is more dangerous
than an empty page, because it gets skimmed and approved. Wherever something
is missing, there is a `TODO(cathal):` marker asking for it, and the build
fails if one of those ever reaches a published page.

## Layout of the repository

```
content/          Everything you write. Markdown and YAML.
  writing/          Essays, notes, teaching material
  pages/            Standalone pages, e.g. About
  data/             tags.yaml and other shared lists
docs/             Documentation for you, in prose
src/              The code that turns content into a website
  components/       Reusable pieces of page
  layouts/          Page shells
  lib/              Shared logic
  pages/            One file per URL
  styles/           theme.css holds every colour on the site
scripts/          Validators and the media ingest tool
.claude/          Skills and commands for AI sessions
```

## Licence

The **code** is MIT. The **content** — writing, photographs, CV — is all
rights reserved. See [LICENSE](LICENSE).
