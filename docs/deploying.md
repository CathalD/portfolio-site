# Getting the site online

The site is hosted on [Vercel](https://vercel.com), which watches the GitHub
repository and rebuilds automatically. Once it is connected, publishing is
nothing more than pushing to `main`.

## Connecting it, once

This is a one-time setup and it has to be done by Cathal, because it requires
signing in to Vercel. An AI session cannot and should not do it.

1. Go to <https://vercel.com> and sign in **with GitHub**. Using the GitHub
   login means Vercel can see the repository without any extra configuration.
2. Click **Add New… → Project**.
3. Find `CathalD/portfolio-site` in the list and click **Import**.
4. Vercel will detect Astro on its own. The settings it fills in should be:
   - Framework Preset: **Astro**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

   If any of those are blank or different, set them to the above.

5. Click **Deploy** and wait a minute or two.

You will get a URL like `portfolio-site-xxxx.vercel.app`. The site is live at
that address immediately.

## Pointing cathaldoherty.ca at it

1. In the Vercel project, go to **Settings → Domains**.
2. Add `cathaldoherty.ca` and `www.cathaldoherty.ca`.
3. Vercel shows you the DNS records to create. Go to wherever the domain is
   registered and add exactly those records.
4. Wait. DNS changes can take anywhere from a few minutes to a few hours.

Vercel issues the HTTPS certificate automatically once DNS resolves. There is
nothing to buy or install.

## Publishing after that

Every push to `main` triggers a rebuild and goes live within about a minute.
Every pull request gets its own preview URL, which is a good way to look at a
change on a phone before merging it.

## What gets published, and what does not

The build publishes only finished work. Anything with `draft: true`, and
anything whose filename begins with `_fixture-`, is excluded. If you want
something to appear on the public site, set `draft: false`.

This is checked twice — once when the site is built and again afterwards by
`npm run validate:content` — so an unfinished piece cannot slip out because of
a single bug.

## When it goes wrong

**The deployment failed.** Open the failed deployment in Vercel and read the
log. It is the same output you would get from `npm run build` locally, so the
fastest way to understand it is usually to run that on your own machine.

**The deployment succeeded but the site looks wrong.** Hard-refresh the page
(<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>). If it still looks wrong, check
you are looking at the production URL and not an old preview deployment.

**A page that used to exist now gives a 404.** This should never happen — URLs
on this site are permanent. Almost always the cause is that a file in
`content/` was renamed. **Rename it back.** If a title needs to change, change
`title` in the frontmatter and add the old one to `formerTitles`; leave the
filename alone. See "The permanent URL contract" in `CLAUDE.md`.

**The domain shows a Vercel error page.** DNS has not finished propagating, or
the records do not match what Vercel asked for. Check them against
**Settings → Domains** again.

**Everything is fine but the changes are not showing.** Confirm the push
actually reached `main` (`git log origin/main -1`), and check the Deployments
tab — a build may have failed, leaving the previous version live. That
fail-safe is intentional: a broken build never replaces a working site.
