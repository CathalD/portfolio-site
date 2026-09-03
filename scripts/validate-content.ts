/*
 * validate-content.ts — the guard that stops unfinished work being published.
 *
 * Run AFTER `astro build`, against dist/. It re-checks, independently of the
 * filtering in src/lib/content.ts, that nothing which should have been held
 * back actually reached the built site. Two independent checks of the same
 * rule is the point: a bug in the filter is caught here rather than shipped.
 *
 * It fails the build if:
 *   1. a `_fixture-` entry produced a page
 *   2. a `draft: true` entry produced a page
 *   3. the word "_fixture-" appears anywhere in the built HTML
 *   4. a TODO(cathal) marker reached the built HTML
 *   5. a piece of content references a related entry that does not exist
 *
 * Run: npm run validate:content
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, readContentFiles, isFixture, walk, report } from './lib/content-files.ts';

const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error('validate:content needs a build first. Run `npm run build`.');
  process.exit(1);
}

const problems: string[] = [];
const files = readContentFiles();
const htmlFiles = walk(DIST, (name) => name.endsWith('.html'));

/* ------------------------------------------------------------------ *
 * 1 + 2. Nothing held back should have produced a page.
 *
 * The URL for a content file is /<collection>/<slug>/, except for `pages`,
 * which publish at the root.
 * ------------------------------------------------------------------ */

function builtPathFor(collection: string, slug: string): string {
  const url = collection === 'pages' ? `/${slug}/` : `/${collection}/${slug}/`;
  return join(DIST, url, 'index.html');
}

for (const file of files) {
  const held = isFixture(file)
    ? 'is a scaffolding fixture'
    : file.data.draft === true
      ? 'is marked `draft: true`'
      : undefined;

  if (held && existsSync(builtPathFor(file.collection, file.slug))) {
    problems.push(
      `${file.relativePath} ${held}, but it was published to ` +
        `${relative(DIST, builtPathFor(file.collection, file.slug))}. ` +
        `Every page must be read through getPublished() in src/lib/content.ts.`,
    );
  }
}

/* ------------------------------------------------------------------ *
 * 3 + 4. Nothing that marks work-in-progress should appear in the HTML.
 *
 * TODO(cathal) markers live in Markdown comments, which the renderer strips
 * for real comments but not from code blocks or frontmatter that leaks
 * through. If one reaches the HTML, a reader can see it.
 * ------------------------------------------------------------------ */

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  const where = relative(DIST, path);

  if (html.includes('_fixture-')) {
    problems.push(
      `${where} contains the string "_fixture-". Scaffolding has leaked into the build.`,
    );
  }
  if (html.includes('TODO(cathal)')) {
    problems.push(
      `${where} contains a TODO(cathal) marker. Either fill it in or move it into an HTML ` +
        `comment in the source, which the Markdown renderer strips.`,
    );
  }
}

/* ------------------------------------------------------------------ *
 * 5. Cross-references must point at something that exists.
 *
 * A related project that has been renamed leaves a link to nowhere, and
 * nothing else on the site would notice.
 * ------------------------------------------------------------------ */

const slugsByCollection = new Map<string, Set<string>>();
for (const file of files) {
  if (!slugsByCollection.has(file.collection)) slugsByCollection.set(file.collection, new Set());
  slugsByCollection.get(file.collection)!.add(file.slug);
}

const RELATION_FIELDS: { field: string; collection: string }[] = [
  { field: 'relatedProjects', collection: 'projects' },
  { field: 'relatedWriting', collection: 'writing' },
  { field: 'project', collection: 'projects' },
];

for (const file of files) {
  for (const { field, collection } of RELATION_FIELDS) {
    const value = file.data[field];
    if (value === undefined) continue;
    const wanted = Array.isArray(value) ? value : [value];
    const known = slugsByCollection.get(collection) ?? new Set<string>();
    for (const slug of wanted) {
      if (typeof slug !== 'string') continue;
      if (!known.has(slug)) {
        problems.push(
          `${file.relativePath}: ${field} refers to "${slug}", but there is no ` +
            `content/${collection}/${slug}. Slugs never change on this site, so this is ` +
            `either a typo or a reference to something not written yet.`,
        );
      }
    }
  }
}

report(
  'Content',
  problems,
  `${files.length} file(s) checked, ${htmlFiles.length} page(s) built. ` +
    `No drafts, fixtures or TODO markers published.`,
);
