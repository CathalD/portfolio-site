/*
 * content-files.ts — shared helpers for the validator scripts.
 *
 * The validators run OUTSIDE Astro (they are plain Node scripts, so they can
 * run in CI without a build), which means they cannot use `getCollection()`.
 * They read the Markdown files directly instead. This file is the one place
 * that knows how to find and parse them, so the validators agree with each
 * other about what "a content file" is.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CONTENT_DIR = join(ROOT, 'content');

/** Fixtures are scaffolding, never real content. See src/lib/content.ts. */
export const FIXTURE_PREFIX = '_fixture-';

export interface ContentFile {
  /** Absolute path on disk. */
  path: string;
  /** Path relative to the repository root, for error messages. */
  relativePath: string;
  /** The collection folder, e.g. 'writing'. */
  collection: string;
  /** The slug this file publishes at. */
  slug: string;
  /** Parsed YAML frontmatter. */
  data: Record<string, unknown>;
  /** The Markdown body, frontmatter removed. */
  body: string;
}

/** Recursively list files under `dir` matching `test`. */
export function walk(dir: string, test: (name: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full, test));
    else if (test(entry.name)) found.push(full);
  }
  return found;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Split a Markdown file into parsed frontmatter and body. */
export function parseFrontmatter(
  source: string,
  forPath: string,
): { data: Record<string, unknown>; body: string } {
  const match = FRONTMATTER.exec(source);
  if (!match) return { data: {}, body: source };
  try {
    const data: unknown = parseYaml(match[1]!) ?? {};
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new Error('frontmatter is not a set of key: value pairs');
    }
    return { data: data as Record<string, unknown>, body: source.slice(match[0].length) };
  } catch (error) {
    throw new Error(
      `Could not parse the frontmatter in ${forPath}:\n  ${(error as Error).message}\n` +
        `  Frontmatter is the YAML block between the two --- lines at the top of the file.`,
      { cause: error },
    );
  }
}

/**
 * Every Markdown file in `content/`, with its frontmatter parsed.
 * `content/data/` and `content/references/` hold YAML and BibTeX and are
 * skipped, because this only looks at `.md`.
 */
export function readContentFiles(): ContentFile[] {
  return walk(CONTENT_DIR, (name) => name.endsWith('.md')).map((path) => {
    const relativePath = relative(ROOT, path);
    const source = readFileSync(path, 'utf8');
    const { data, body } = parseFrontmatter(source, relativePath);
    const segments = relative(CONTENT_DIR, path).split('/');
    const collection = segments[0] ?? '';
    /* A project is a folder with an index.md; everything else is a bare file. */
    const rest = segments.slice(1).join('/');
    const slug = rest.replace(/\/index\.md$/, '').replace(/\.md$/, '');
    return { path, relativePath, collection, slug, data, body };
  });
}

export function isFixture(file: ContentFile): boolean {
  return file.slug.split('/').some((segment) => segment.startsWith(FIXTURE_PREFIX));
}

/** Print a heading, the findings, and exit non-zero if there are any. */
export function report(title: string, problems: string[], okMessage: string): void {
  if (problems.length === 0) {
    console.log(`${title}: ${okMessage}`);
    return;
  }
  console.error(`\n${title}: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('');
  process.exit(1);
}
