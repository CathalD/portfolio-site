/*
 * validate-refs.ts — every citation key used in content must exist in the .bib.
 *
 * Citations on this site are NEVER hand-typed. content/references/library.bib
 * is exported from Zotero, and content refers to entries in it by key. That is
 * the whole reason this check exists: a fabricated or mistyped citation under
 * the name of a working scientist is a reputational problem, and it is exactly
 * the kind of error that is invisible on the page.
 *
 * The .bib does not exist until Stage 4. Until then this passes when no
 * content cites anything, and fails the moment something does.
 *
 * Run: npm run validate:refs
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, readContentFiles, report } from './lib/content-files.ts';

const BIB_FILE = join(ROOT, 'content/references/library.bib');

const problems: string[] = [];

/** Citation keys defined in the .bib, e.g. `@article{smith2020coastal, ...`. */
function readBibKeys(): Set<string> {
  if (!existsSync(BIB_FILE)) return new Set();
  const source = readFileSync(BIB_FILE, 'utf8');
  const keys = new Set<string>();
  for (const match of source.matchAll(/@[a-zA-Z]+\s*\{\s*([^,\s}]+)\s*,/g)) {
    keys.add(match[1]!);
  }
  return keys;
}

const bibKeys = readBibKeys();

const usage = new Map<string, string[]>();
for (const file of readContentFiles()) {
  const refs = file.data.references;
  if (!Array.isArray(refs)) continue;
  for (const key of refs) {
    if (typeof key !== 'string') {
      problems.push(`${file.relativePath}: a reference key is not a string.`);
      continue;
    }
    if (!usage.has(key)) usage.set(key, []);
    usage.get(key)!.push(file.relativePath);
  }
}

if (usage.size > 0 && !existsSync(BIB_FILE)) {
  problems.push(
    `Content cites ${usage.size} reference(s) but content/references/library.bib does not exist. ` +
      `Export the library from Zotero to that path. Do not hand-write the file.`,
  );
} else {
  for (const [key, users] of usage) {
    if (!bibKeys.has(key)) {
      problems.push(
        `"${key}" is cited by ${users.join(', ')} but is not in content/references/library.bib. ` +
          `Re-export from Zotero — do not add the entry by hand.`,
      );
    }
  }
}

report(
  'References',
  problems,
  bibKeys.size === 0 && usage.size === 0
    ? 'no citations yet, and no library.bib. Nothing to check.'
    : `${usage.size} key(s) cited, all present in library.bib (${bibKeys.size} entries).`,
);
