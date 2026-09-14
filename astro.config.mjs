// @ts-check
/*
 * astro.config.mjs — site-wide build configuration.
 *
 * Two things here are load-bearing and should not be casually changed:
 *
 *  1. `site` is the canonical origin. Sitemap, RSS and every canonical <link>
 *     derive from it. Getting it wrong silently breaks SEO, not the build.
 *
 *  2. The `fonts` block self-hosts Source Serif 4 and Inter from files
 *     committed in src/assets/fonts/. There is deliberately no Google Fonts
 *     or Fontsource *provider* here: a build-time network fetch is a
 *     dependency that can rot, and this site is meant to still build in 2035.
 *     See CLAUDE.md, "Things that look wrong but are deliberate".
 */

import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/** Unicode ranges matching the subset files in src/assets/fonts/. */
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

/**
 * One `@font-face` variant. Each file is a single-axis variable font, so a
 * single file covers every weight in the range.
 *
 * @param {'source-serif-4' | 'inter'} family
 * @param {'latin' | 'latin-ext'} subset
 * @param {'normal' | 'italic'} style
 * @param {string} weightRange e.g. '200 900'
 */
function variant(family, subset, style, weightRange) {
  return {
    src: /** @type {[string]} */ ([`./src/assets/fonts/${family}-${subset}-${style}.woff2`]),
    weight: weightRange,
    style,
    unicodeRange: /** @type {[string]} */ ([subset === 'latin' ? LATIN : LATIN_EXT]),
    display: /** @type {const} */ ('swap'),
  };
}

/**
 * The four variants of one family: latin and latin-ext, upright and italic.
 * Written out rather than generated so the array keeps its tuple type.
 *
 * @param {'source-serif-4' | 'inter'} family
 * @param {string} weightRange
 */
function variants(family, weightRange) {
  return /** @type {[ReturnType<typeof variant>, ...ReturnType<typeof variant>[]]} */ ([
    variant(family, 'latin', 'normal', weightRange),
    variant(family, 'latin', 'italic', weightRange),
    variant(family, 'latin-ext', 'normal', weightRange),
    variant(family, 'latin-ext', 'italic', weightRange),
  ]);
}

export default defineConfig({
  // TODO(cathal): replace this origin (and public/robots.txt) after you buy a domain.
  site: 'https://portfolio-site-phi-six-42.vercel.app',

  integrations: [
    sitemap({
      // Drafts and fixtures never reach dist/, so anything present here is
      // publishable by definition. See src/lib/content.ts.
      changefreq: 'monthly',
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Source Serif 4',
      cssVariable: '--font-source-serif',
      fallbacks: ['Charter', 'Georgia', 'serif'],
      options: { variants: variants('source-serif-4', '200 900') },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['system-ui', 'sans-serif'],
      options: { variants: variants('inter', '100 900') },
    },
  ],

  markdown: {
    // NOTE: `remarkPlugins` is deprecated in Astro 7 (the default Markdown
    // processor is no longer unified/remark). Nothing here needs it — reading
    // time is computed from the raw source by src/lib/reading-time.ts, which
    // is independent of whichever Markdown engine is current.
    shikiConfig: {
      // Light theme only — this site has no dark mode.
      theme: 'github-light',
      wrap: true,
    },
  },
});
