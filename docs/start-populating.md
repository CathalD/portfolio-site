# Start populating the site

The site is deliberately useful while empty: unfinished entries remain drafts
and do not publish. You supply the factual text and photographs; the code
turns them into pages. Do not fill gaps with plausible-sounding placeholders.

## Where your files go

| What you have                        | Put it here                                  | When it appears                                     |
| ------------------------------------ | -------------------------------------------- | --------------------------------------------------- |
| About text                           | `content/pages/about.md`                     | After you write it and set `draft: false`           |
| An essay or note                     | `content/writing/[permanent-slug].md`        | After `draft: false`                                |
| A project                            | `content/projects/[permanent-slug]/index.md` | After `draft: false`                                |
| A photograph original for processing | `content/gallery/_inbox/`                    | Never directly; run `npm run ingest`                |
| A gallery item's text and metadata   | `content/gallery/[permanent-slug].md`        | After `draft: false`                                |
| The list of allowed tags             | `content/data/tags.yaml`                     | Tag hubs appear for defined tags                    |
| A landscape hero photograph          | `src/assets/`                                | After the home page import and alt text are updated |
| Your existing CV source file         | `content/cv/_inbox/`                         | Not published; this folder is Git-ignored           |
| A Zotero BibTeX export               | `content/references/library.bib`             | Not displayed until bibliography work is finished   |

Create the `_inbox` and `references` folders when you have those files; they
are not present in the initial repository. `_inbox` folders are Git-ignored.

The existing `_fixture-` files show the required shape but contain no real
content. Keep them as draft tests or remove them when real entries cover the
layouts. Do not rename the filename or folder of anything already published;
its URL is permanent.

Before changing a draft to `false`, check its title, summary, dates, alt text,
links, tags, and any citation keys against your own records. Run
`npm run check`. A passing build excludes other drafts and fixtures. Pushing
the result to `main` lets Vercel rebuild the live site.

## Still waiting for your source material

The CV is intentionally not a public page yet. Supply your current CV and a
Zotero BibTeX export before the structured CV, bibliography, and PDF workflow
are finalized; the site must not fabricate or hand-type publications. Do not
add citation keys to public entries yet: they can be validated but are not
rendered as reference lists. The hero remains a visibly plain placeholder
until you choose a photograph and
provide accurate alt text. Contact, affiliation and social links likewise
need your preferred details before they can be added.

The temporary canonical site address is
`https://portfolio-site-phi-six-42.vercel.app`. After you buy a domain, change
`site` in `astro.config.mjs`, the sitemap line in `public/robots.txt`, and
the domain settings in Vercel together. Check canonical links and the sitemap
on the newly deployed site before directing visitors there.
