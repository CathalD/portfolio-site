# Adding a project

A project is one folder containing one Markdown file:
`content/projects/[permanent-slug]/index.md`. The folder name becomes
`/projects/[permanent-slug]/`; choose it carefully and do not rename it after
publication. The page builds its contents links from whichever `##` headings
you use.

For a starting shape, look at
`content/projects/_fixture-project-one/index.md`. It is deliberately fake,
`draft: true`, and never published. Do not publish its placeholder text.

Required frontmatter is `title`, `summary`, `status`, and `year`. Status is one
of `taking-off`, `in-progress`, `completed`, or `archived`. Optional fields are
`endYear`, `duration`, `tags`, `featured`, `heroImage` with `heroAlt`,
`relatedProjects`, `relatedWriting`, `references`, `publishedAt`, `updatedAt`,
and `formerTitles`. The exact schema is in `src/content.config.ts`.
Citation keys are accepted and checked, but reference lists are not rendered
until the Zotero-backed bibliography is built; leave `references` empty for now.

Write the body in your own words. Sections such as Overview, Planning, Build,
Results and Reflection are optional; only include what the project actually
needs. Set `draft: false` only after reviewing every fact and clearing all
`TODO(cathal)` markers. Run `npm run check` before publishing.

If you use tags, first add their permanent slugs and labels to
`content/data/tags.yaml`. The build rejects a tag that is not on that list.
Related content must already exist at the slug you name. An archived project
keeps this same URL; only its status changes.

If something fails, read the file and field named in the check output. A
missing tag belongs in `tags.yaml` or is a spelling error; a missing related
slug points to a file that has not been added or was renamed.
