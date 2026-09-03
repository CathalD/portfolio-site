/*
 * validate-tags.ts — every tag used in content must exist in tags.yaml.
 *
 * THE REASON THIS EXISTS: without it, `eelgrass`, `Eelgrass` and `seagrass`
 * become three tags holding a third of the relevant work each, and nobody
 * notices for two years. A canonical list plus a build failure is the only
 * thing that reliably prevents taxonomy drift.
 *
 * The canonical list is content/data/tags.yaml. Adding a tag means adding it
 * there first — which is a deliberate speed bump, not an oversight.
 *
 * Run: npm run validate:tags
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ROOT, readContentFiles, report } from './lib/content-files.ts';

const TAGS_FILE = join(ROOT, 'content/data/tags.yaml');

interface TagDefinition {
  slug: string;
  label: string;
  description?: string;
  group?: string;
}

const problems: string[] = [];

if (!existsSync(TAGS_FILE)) {
  console.error(`Tags: content/data/tags.yaml is missing. It is the canonical tag list.`);
  process.exit(1);
}

const parsed: unknown = parseYaml(readFileSync(TAGS_FILE, 'utf8'));
const definitions: TagDefinition[] =
  parsed && typeof parsed === 'object' && Array.isArray((parsed as { tags?: unknown }).tags)
    ? ((parsed as { tags: TagDefinition[] }).tags ?? [])
    : [];

const canonical = new Set<string>();
for (const definition of definitions) {
  if (!definition || typeof definition.slug !== 'string') {
    problems.push(`content/data/tags.yaml has an entry without a \`slug\`.`);
    continue;
  }
  if (canonical.has(definition.slug)) {
    problems.push(`content/data/tags.yaml defines "${definition.slug}" more than once.`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(definition.slug)) {
    problems.push(
      `content/data/tags.yaml: "${definition.slug}" is not lower-case kebab-case. ` +
        `Slugs appear in URLs (/tags/${definition.slug}) and never change.`,
    );
  }
  if (typeof definition.label !== 'string' || definition.label.trim() === '') {
    problems.push(`content/data/tags.yaml: "${definition.slug}" has no \`label\`.`);
  }
  canonical.add(definition.slug);
}

/* Which tags does the content actually use, and where. */
const usage = new Map<string, string[]>();
for (const file of readContentFiles()) {
  const tags = file.data.tags;
  if (!Array.isArray(tags)) continue;
  for (const tag of tags) {
    if (typeof tag !== 'string') {
      problems.push(`${file.relativePath}: a tag is not a string.`);
      continue;
    }
    if (!usage.has(tag)) usage.set(tag, []);
    usage.get(tag)!.push(file.relativePath);
  }
}

for (const [tag, users] of usage) {
  if (!canonical.has(tag)) {
    const suggestion = [...canonical].find(
      (known) =>
        known.toLowerCase() === tag.toLowerCase() || known.includes(tag) || tag.includes(known),
    );
    problems.push(
      `"${tag}" is used by ${users.join(', ')} but is not in content/data/tags.yaml.` +
        (suggestion ? ` Did you mean "${suggestion}"?` : '') +
        ` Add it to tags.yaml, or change the content to use an existing tag.`,
    );
  }
}

/* Unused canonical tags are not an error — a tag can be defined ahead of the
   work — but they are worth surfacing, because /tags/[slug] will be empty. */
const unused = [...canonical].filter((tag) => !usage.has(tag));
if (unused.length > 0) {
  console.log(`Tags: defined but not yet used — ${unused.join(', ')}`);
}

report(
  'Tags',
  problems,
  `${canonical.size} canonical tag(s), ${usage.size} in use, all accounted for.`,
);
