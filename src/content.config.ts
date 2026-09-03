/*
 * content.config.ts — collection definitions and frontmatter schemas.
 *
 * This file is the authoritative description of what a piece of content on
 * this site may contain. If you are adding a field, add it here first; the
 * schema is what the build validates against, and a typo in frontmatter
 * becomes a build error rather than a silently missing value.
 *
 * Content lives in `content/` at the REPOSITORY ROOT, not in `src/content/`.
 * That is deliberate: the person maintaining this site writes prose, not
 * TypeScript, and the folder they care about should not be buried inside the
 * source tree. Astro's glob loader is happy to read from anywhere.
 *
 * Collections arrive by stage:
 *   Stage 1  writing
 *   Stage 2  projects, plus the data/*.yaml taxonomy
 *   Stage 3  gallery
 *   Stage 4  cv, references
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* ------------------------------------------------------------------ *
 * Shared field definitions. Reused across collections so that, for
 * example, `tags` means exactly one thing everywhere on the site.
 * ------------------------------------------------------------------ */

/**
 * Tags are validated for *shape* here and for *membership* by
 * `npm run validate:tags`, which checks every tag against
 * content/data/tags.yaml. Zod cannot do the membership check because the
 * canonical list is data, not code. The two together are what stop
 * `eelgrass` / `Eelgrass` / `seagrass` drifting apart.
 */
const tags = z
  .array(
    z
      .string()
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        'Tags must be lower-case kebab-case, e.g. "coastal-ecology".',
      ),
  )
  .default([]);

/**
 * BibTeX citation keys, checked against content/references/library.bib by
 * `npm run validate:refs`. Citations are never hand-typed on this site — the
 * .bib is exported from Zotero. See CLAUDE.md.
 */
const references = z.array(z.string()).optional();

/**
 * A hero image is a path, resolved at render time through src/lib/media.ts
 * (added in Stage 3). Alt text is mandatory whenever an image is present —
 * enforced by the refinement on each collection below, because Zod cannot
 * express "required if a sibling field exists" any other way.
 */
const heroImage = z.string().optional();
const heroAlt = z.string().optional();

/**
 * "heroAlt is required when heroImage is set" — a rule Zod cannot express
 * declaratively, so it is a refinement. Applied with `.superRefine()` to every
 * collection that can carry a hero image.
 */
function checkHeroAlt(
  data: { heroImage?: string | undefined; heroAlt?: string | undefined },
  ctx: z.RefinementCtx,
): void {
  if (data.heroImage && !data.heroAlt?.trim()) {
    ctx.addIssue({
      code: 'custom',
      path: ['heroAlt'],
      message:
        'heroAlt is required when heroImage is set. Describe what the image shows; ' +
        'do not repeat the title. An image without alt text is inaccessible.',
    });
  }
}

/* ------------------------------------------------------------------ *
 * writing — essays, technical notes, teaching material, reviews.
 *
 * The canonical URL for a piece of writing is ALWAYS this site.
 * `substackUrl` is an outbound link to a copy elsewhere, never a sync
 * target and never a canonical. See CLAUDE.md.
 *
 * NOTE: there is no `readingTime` field. It is computed at build time from
 * the text by src/lib/reading-time.ts, so it cannot go stale.
 * ------------------------------------------------------------------ */

const writing = defineCollection({
  loader: glob({ base: './content/writing', pattern: '**/*.md' }),
  schema: z
    .object({
      title: z.string().min(1),

      /** 1-2 sentences. Used on cards and as the page meta description. */
      summary: z.string().min(1),

      category: z.enum(['essay', 'technical', 'teaching', 'research', 'idea', 'review']),

      tags,

      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),

      references,

      /** Project slugs. Existence is checked by validate:content in Stage 2. */
      relatedProjects: z.array(z.string()).optional(),

      /** Outbound link only. The canonical URL stays on this site. */
      substackUrl: z.url().optional(),

      heroImage,
      heroAlt,

      /**
       * Titles change; slugs do not. When a title changes, the old one goes
       * here so the piece stays findable under what it used to be called.
       */
      formerTitles: z.array(z.string()).optional(),

      /**
       * Drafts default to TRUE. Publishing is an explicit, deliberate act:
       * you have to set `draft: false` to put something on the internet.
       */
      draft: z.boolean().default(true),
    })
    .superRefine(checkHeroAlt),
});

/* ------------------------------------------------------------------ *
 * pages — standalone prose pages (About, and anything else that is a
 * page rather than a post). One file, one URL.
 * ------------------------------------------------------------------ */

const pages = defineCollection({
  loader: glob({ base: './content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { writing, pages };
