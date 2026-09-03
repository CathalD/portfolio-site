/*
 * check-links.ts — verify that no internal link on the built site 404s.
 *
 * This matters more on this site than on most. The URL contract in CLAUDE.md
 * says a published URL never changes and never breaks; that promise is worth
 * nothing unless something checks it. Run against dist/ after a build.
 *
 * It checks INTERNAL links only. External links are deliberately out of
 * scope: they fail for reasons outside this repository (rate limits, sites
 * that block CI, temporary outages), and a check that cries wolf gets
 * disabled. Rotting external links are a content problem, reviewed by a human.
 *
 * Run: npm run check:links
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, posix } from 'node:path';
import { ROOT, walk, report } from './lib/content-files.ts';

const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error('check:links needs a build first. Run `npm run build`.');
  process.exit(1);
}

const problems: string[] = [];
const htmlFiles = walk(DIST, (name) => name.endsWith('.html'));

/** Attributes that hold a URL we can resolve to a file. */
const URL_ATTRIBUTES = /(?:href|src)\s*=\s*["']([^"']+)["']/g;

/** Collect every id="..." on a page, so fragment links can be checked too. */
function idsIn(html: string): Set<string> {
  const ids = new Set<string>();
  for (const match of html.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)) ids.add(match[1]!);
  return ids;
}

/** Map a site-absolute URL path to the file that serves it, if any. */
function resolveToFile(urlPath: string): string | undefined {
  const decoded = decodeURIComponent(urlPath);
  const candidates = [
    join(DIST, decoded),
    join(DIST, decoded, 'index.html'),
    join(DIST, `${decoded}.html`),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return undefined;
}

const idsByFile = new Map<string, Set<string>>();
for (const path of htmlFiles) idsByFile.set(path, idsIn(readFileSync(path, 'utf8')));

let checked = 0;

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  const from = `/${relative(DIST, path)}`;
  /* The URL this page is served at, so relative links resolve correctly. */
  const pageUrl = from.replace(/\/index\.html$/, '/').replace(/\.html$/, '');

  for (const match of html.matchAll(URL_ATTRIBUTES)) {
    const raw = match[1]!;

    /* Out of scope: external, protocol-relative, and non-navigational schemes. */
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
    if (raw.startsWith('#')) {
      /* Same-page fragment. */
      const id = raw.slice(1);
      checked += 1;
      if (id && !idsByFile.get(path)?.has(id)) {
        problems.push(`${from} links to "${raw}" but no element on that page has id="${id}".`);
      }
      continue;
    }

    const [target = '', fragment] = raw.split('#');
    if (target === '') continue;

    const absolute = target.startsWith('/')
      ? target
      : posix.resolve(posix.dirname(pageUrl), target);

    checked += 1;
    const file = resolveToFile(absolute);

    if (!file) {
      problems.push(
        `${from} links to "${raw}", which does not exist in the build. ` +
          `URLs on this site are permanent — if this used to work, do not delete the link, ` +
          `restore the page.`,
      );
      continue;
    }

    if (fragment && file.endsWith('.html')) {
      const ids = idsByFile.get(file) ?? idsIn(readFileSync(file, 'utf8'));
      if (!ids.has(fragment)) {
        problems.push(`${from} links to "${raw}" but that page has no id="${fragment}".`);
      }
    }
  }
}

report(
  'Links',
  problems,
  `${checked} internal link(s) across ${htmlFiles.length} page(s), all resolve.`,
);
