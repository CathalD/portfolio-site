/*
 * /rss.xml — the writing feed.
 *
 * Reads through getPublished(), so drafts and fixtures never appear in the
 * feed. That matters more here than anywhere else on the site: a feed reader
 * caches what it fetches, so an accidentally published draft cannot be
 * recalled by deleting it.
 *
 * The feed carries summaries, not full text. Full text in a feed means the
 * canonical version of a piece is whatever a reader's aggregator kept, which
 * is the opposite of what this site is for.
 */

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, byDateDesc } from '../lib/content.ts';
import { SITE_TITLE, SITE_DESCRIPTION } from '../lib/site.ts';

export async function GET(context: APIContext) {
  /* `site` is set in astro.config.mjs and the feed is meaningless without it,
     since every link in it is absolute. */
  if (!context.site) {
    throw new Error(
      '`site` is not set in astro.config.mjs; the RSS feed needs an absolute origin.',
    );
  }

  const entries = byDateDesc(await getPublished('writing'), (entry) => entry.data.publishedAt);

  return rss({
    title: `${SITE_TITLE} — Writing`,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.publishedAt,
      link: `/writing/${entry.id}/`,
      categories: entry.data.tags,
    })),
    customData: '<language>en-ca</language>',
  });
}
