/*
 * content.ts — the ONLY place that decides what is publishable.
 *
 * Every page, the RSS feed and the sitemap read collections through
 * `getPublished()`. No page calls `getCollection()` directly. That single
 * chokepoint is what makes the guarantee below enforceable:
 *
 *   A draft or a fixture never reaches the production build.
 *
 * Behaviour differs between dev and build, on purpose:
 *   - `astro dev`   shows drafts and fixtures, so work in progress is visible.
 *   - `astro build` excludes them, so nothing unfinished is ever published.
 *
 * `npm run validate:content` re-checks the built output independently, so a
 * mistake here is caught rather than shipped.
 */

import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Scaffolding fixtures are named `_fixture-*`. They exist to prove layouts
 * render and contain structural filler only — never anything that could be
 * mistaken for real work by a conservation biologist. See CLAUDE.md.
 */
export const FIXTURE_PREFIX = '_fixture-';

export function isFixture(id: string): boolean {
  return id.split('/').some((segment) => segment.startsWith(FIXTURE_PREFIX));
}

export function isPublishable(entry: { id: string; data: { draft?: boolean } }): boolean {
  return entry.data.draft !== true && !isFixture(entry.id);
}

/**
 * Read a collection, filtering out drafts and fixtures in production builds.
 * Use this everywhere instead of `getCollection`.
 */
export async function getPublished<C extends CollectionKey>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  if (!import.meta.env.PROD) return entries;
  return entries.filter((entry) => isPublishable(entry));
}

/** Newest first, by any date field on the entry. */
export function byDateDesc<T>(items: T[], date: (item: T) => Date | undefined): T[] {
  return [...items].sort((a, b) => (date(b)?.valueOf() ?? 0) - (date(a)?.valueOf() ?? 0));
}

/** Format a date for display. Consistent across the whole site. */
export function formatDate(date: Date, locale = 'en-CA'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Machine-readable date for <time datetime="..."> */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
