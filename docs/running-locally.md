# Running the site on your own computer

You do not need to run the site locally to change it — you can edit files on
GitHub and Vercel will rebuild. But running it locally lets you see a change
before anyone else does, which is worth the ten minutes of setup.

## Setting up, once

You need Node.js, which is the program that builds the site. This repository
pins a version in a file called `.nvmrc` so that your computer, GitHub and
Vercel all use the same one.

The tidiest way to install it is with a version manager called `fnm`, which
reads that file automatically. On a Mac with [Homebrew](https://brew.sh):

```bash
brew install fnm
```

Then add it to your shell so it starts automatically. This has already been
done on Cathal's laptop; on a new machine, add these lines to `~/.zshrc`:

```bash
eval "$(fnm env --use-on-cd --shell zsh)"
```

Close and reopen the terminal. Now, in the project folder:

```bash
fnm install
npm install
```

`fnm install` reads `.nvmrc` and fetches the right Node. `npm install`
downloads everything the site is built from, into a folder called
`node_modules` which is deliberately not stored in the repository.

## Every time after that

```bash
npm run dev
```

Then open <http://localhost:4321>. Leave that command running while you work —
when you save a file in `content/`, the browser updates by itself.

Press <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal to stop it.

## An important difference between the dev server and the real site

**The dev server shows drafts. The published site does not.**

Anything with `draft: true` in its frontmatter, and anything whose filename
starts with `_fixture-`, appears at <http://localhost:4321> and does not appear
on cathaldoherty.ca. That is on purpose: it lets you see work in progress
without risking publishing it.

To see exactly what the public would see:

```bash
npm run build
npm run preview
```

That builds the real site and serves it at <http://localhost:4321>. Drafts will
be missing, which is correct.

## Checking your work

```bash
npm run check
```

This is the same set of checks that runs on GitHub before anything is
published. It takes under a minute and it catches: broken links, tags that are
not in the canonical list, citations that are not in the Zotero export, images
without alt text, drafts that would have been published by mistake, and colours
that fail the accessibility contrast requirement.

Run it before you push. If it fails, [troubleshooting.md](troubleshooting.md)
explains what each failure means.

## When it goes wrong

**`command not found: npm`** — Node is not installed, or your shell has not
picked up `fnm`. Close the terminal, open a new one, and try again. If it still
fails, run `brew install fnm` and add the line above to `~/.zshrc`.

**`npm install` fails with permission errors** — you are probably running it
somewhere other than the project folder, or with `sudo`. Never use `sudo` with
`npm` here. `cd` into the project folder and try again.

**The dev server starts but the page will not load** — something else may
already be using port 4321. Stop any other copy of the dev server, or run
`npm run dev -- --port 4322` and use that address instead.

**Changes to a file in `content/` do not appear** — check the terminal running
`npm run dev` for a red error message. A mistake in the frontmatter (the block
between the two `---` lines) will stop that one file loading and say which
field is wrong.

**Everything is broken and you did not change anything** — delete
`node_modules` and `.astro`, then run `npm install` again. This fixes most
mysterious failures and costs nothing but a minute.

```bash
rm -rf node_modules .astro
npm install
```
