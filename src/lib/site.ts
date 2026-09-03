/*
 * site.ts — global constants.
 *
 * Anything that appears in more than one place and is not content belongs
 * here. Content itself never lives in this file.
 */

export const SITE_TITLE = 'Cathal Doherty';

/** Used as the default meta description and in the RSS channel. */
export const SITE_DESCRIPTION =
  'Conservation biologist based in Canada. Projects, writing, field photography and an archive of work.';

export const SITE_AUTHOR = 'Cathal Doherty';
export const SITE_LOCALE = 'en-CA';

/*
 * The permanent URL contract. These paths are a promise: once published, a
 * URL on this site never changes and never 404s. See CLAUDE.md.
 */
export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/cv', label: 'CV' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/archive', label: 'Archive' },
] as const;

/**
 * Routes not yet built. Nav renders these as plain text rather than links, so
 * the navigation is complete from day one without shipping a 404. Delete an
 * entry from this list in the stage that builds the route.
 */
export const UNBUILT_ROUTES: readonly string[] = ['/cv', '/projects', '/gallery', '/archive'];
