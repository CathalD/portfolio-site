---
description: Branch, commit, push, and open a pull request with a content summary.
---

Publish the current work as a pull request.

## Before anything else

Run the full gate and do not proceed until it is green:

```bash
npm run check
```

## Then

1. **Check the branch.** If the current branch is `main`, create a feature
   branch first. Name it for what changed: `writing/coastal-monitoring-notes`,
   `feat/gallery-lightbox`, `fix/nav-focus-ring`.

2. **Review what is actually being committed.** Run `git status` and
   `git diff`. Specifically confirm that none of these have crept in:
   - files under any `_inbox/` directory
   - full-resolution image originals
   - `scripts/geo-allowlist.txt`
   - `.env`

3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/).
   Content changes use `content:`, e.g.
   `content: add writing on eelgrass transect methods`.
   Keep commits small and coherent — one idea each.

4. **Push and open a PR.** Use `gh pr create`. The body must fill in
   `.github/pull_request_template.md`, and the **content review checklist is
   the important half** — Cathal reviews content, not code.

## What to put in the PR description

Lead with what a reader of the site would notice, not what the diff contains.

For content changes, list every new or changed entry with its **URL**, so the
review can be done by reading pages rather than Markdown. Call out explicitly:

- any new tag added to `content/data/tags.yaml`
- any citation key added, and confirmation it came from a Zotero re-export
- any photograph whose GPS coordinates were **kept**, and why that is safe
- any `TODO(cathal)` still outstanding, and what it is asking

**Do not tick the content checklist boxes on Cathal's behalf.** They are his to
confirm. Leave them unticked and say so in the PR description.
