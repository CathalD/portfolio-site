/*
 * check-a11y.ts — accessibility checks that can run without a browser.
 *
 * Right now this verifies COLOUR CONTRAST by parsing src/styles/theme.css and
 * asserting every foreground/background pair the site actually uses meets the
 * WCAG 2.1 AA threshold. The spec for this site says contrast must be
 * "verified, not assumed" — this is that verification, and it fails the build.
 *
 * It deliberately has zero dependencies. Full automated auditing of the
 * rendered pages (landmarks, labels, focus order) arrives in Stage 4; when it
 * does, add it to this file rather than creating a second a11y script.
 *
 * Run: npm run check:a11y
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** WCAG 2.1 AA thresholds. */
const AA_NORMAL_TEXT = 4.5;
/* Also the threshold for large text (>=24px, or >=18.66px bold), but every
   pair below is either normal-size text or a non-text boundary. */
const AA_NON_TEXT = 3.0; // UI component boundaries, focus indicators

type Pair = {
  fg: string;
  bg: string;
  min: number;
  /** Where this combination actually appears, so a failure is actionable. */
  usage: string;
};

/**
 * Every foreground/background combination the site renders. Add a row here
 * when you introduce a new one — an unlisted pair is an unverified pair.
 */
const PAIRS: Pair[] = [
  // Body and headings
  { fg: 'color-ink', bg: 'color-paper', min: AA_NORMAL_TEXT, usage: 'body text on the page' },
  { fg: 'color-ink', bg: 'color-surface', min: AA_NORMAL_TEXT, usage: 'text inside cards' },
  {
    fg: 'color-ink',
    bg: 'color-surface-raised',
    min: AA_NORMAL_TEXT,
    usage: 'text on raised surfaces',
  },
  { fg: 'color-ink', bg: 'color-accent-wash', min: AA_NORMAL_TEXT, usage: 'text on tinted blocks' },

  // Metadata and captions
  {
    fg: 'color-ink-muted',
    bg: 'color-paper',
    min: AA_NORMAL_TEXT,
    usage: 'dates, captions, metadata',
  },
  { fg: 'color-ink-muted', bg: 'color-surface', min: AA_NORMAL_TEXT, usage: 'card metadata' },
  {
    fg: 'color-ink-faint',
    bg: 'color-paper',
    min: AA_NORMAL_TEXT,
    usage: 'quietest text on the page',
  },

  // Links
  { fg: 'color-accent', bg: 'color-paper', min: AA_NORMAL_TEXT, usage: 'links in body text' },
  { fg: 'color-accent', bg: 'color-surface', min: AA_NORMAL_TEXT, usage: 'links inside cards' },
  {
    fg: 'color-accent',
    bg: 'color-accent-wash',
    min: AA_NORMAL_TEXT,
    usage: 'links on tinted blocks',
  },
  { fg: 'color-accent-strong', bg: 'color-paper', min: AA_NORMAL_TEXT, usage: 'hovered links' },

  // Focus ring must be visible on every surface it can land on.
  { fg: 'color-focus', bg: 'color-paper', min: AA_NON_TEXT, usage: 'focus ring on the page' },
  { fg: 'color-focus', bg: 'color-surface', min: AA_NON_TEXT, usage: 'focus ring on cards' },
  {
    fg: 'color-focus',
    bg: 'color-accent-wash',
    min: AA_NON_TEXT,
    usage: 'focus ring on tinted blocks',
  },

  // Hairline rules are non-text UI boundaries.
  { fg: 'color-rule-strong', bg: 'color-paper', min: AA_NON_TEXT, usage: 'emphasised borders' },

  // Status badges (projects). Small text, so held to the normal-text bar.
  {
    fg: 'color-status-taking-off',
    bg: 'color-paper',
    min: AA_NORMAL_TEXT,
    usage: 'status badge: taking off',
  },
  {
    fg: 'color-status-in-progress',
    bg: 'color-paper',
    min: AA_NORMAL_TEXT,
    usage: 'status badge: in progress',
  },
  {
    fg: 'color-status-completed',
    bg: 'color-paper',
    min: AA_NORMAL_TEXT,
    usage: 'status badge: completed',
  },
  {
    fg: 'color-status-archived',
    bg: 'color-paper',
    min: AA_NORMAL_TEXT,
    usage: 'status badge: archived',
  },
  {
    fg: 'color-status-archived',
    bg: 'color-surface',
    min: AA_NORMAL_TEXT,
    usage: 'archived badge on cards',
  },

  // Homepage hero. The scrim is composited over an unknown photograph, so the
  // check below uses the WORST CASE: the scrim at its configured opacity over
  // pure white. Any darker photograph only improves the ratio.
  {
    fg: 'color-on-scrim',
    bg: '__scrim_over_white',
    min: AA_NORMAL_TEXT,
    usage: 'hero heading over the scrim',
  },
  {
    fg: 'color-on-scrim-muted',
    bg: '__scrim_over_white',
    min: AA_NORMAL_TEXT,
    usage: 'hero subtitle over the scrim',
  },
];

// ---------------------------------------------------------------------------
// Colour maths (WCAG 2.1 relative luminance + contrast ratio).
// ---------------------------------------------------------------------------

type Rgb = [number, number, number];

function parseHex(hex: string): Rgb {
  const h = hex.replace('#', '').trim();
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Not a hex colour: ${hex}`);
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite `fg` over `bg` at `alpha`, as a browser would. */
function composite(fg: Rgb, bg: Rgb, alpha: number): Rgb {
  return [0, 1, 2].map((i) => Math.round(fg[i]! * alpha + bg[i]! * (1 - alpha))) as Rgb;
}

// ---------------------------------------------------------------------------
// Read the tokens out of theme.css.
// ---------------------------------------------------------------------------

const css = readFileSync(join(root, 'src/styles/theme.css'), 'utf8');

const tokens = new Map<string, string>();
for (const match of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8}|[0-9.]+)\s*;/g)) {
  tokens.set(match[1]!, match[2]!);
}

function token(name: string): string {
  const value = tokens.get(name);
  if (value === undefined) {
    throw new Error(
      `theme.css has no token --${name}, but check-a11y.ts expects one.\n` +
        `Either add the token or remove the pair from PAIRS in scripts/check-a11y.ts.`,
    );
  }
  return value;
}

/** Worst-case hero background: the scrim colour over a pure-white photograph. */
function scrimOverWhite(): Rgb {
  const opacity = Number(token('scrim-opacity'));
  return composite(parseHex(token('color-scrim')), [255, 255, 255], opacity);
}

function resolve(name: string): Rgb {
  if (name === '__scrim_over_white') return scrimOverWhite();
  return parseHex(token(name));
}

// ---------------------------------------------------------------------------
// Run the checks.
// ---------------------------------------------------------------------------

const failures: string[] = [];
const results: string[] = [];

for (const pair of PAIRS) {
  const ratio = contrastRatio(resolve(pair.fg), resolve(pair.bg));
  const rounded = Math.round(ratio * 100) / 100;
  const ok = ratio >= pair.min;
  const line = `${ok ? 'PASS' : 'FAIL'}  ${rounded.toFixed(2)}:1 (needs ${pair.min}:1)  ${pair.fg} on ${pair.bg}  — ${pair.usage}`;
  results.push(line);
  if (!ok) failures.push(line);
}

console.log('Colour contrast (WCAG 2.1 AA)\n');
console.log(results.join('\n'));

// Guard against a hex value escaping theme.css into the rest of the codebase.
const strayHex: string[] = [];
function inspect(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      inspect(path);
      continue;
    }
    if (path === join(root, 'src/styles/theme.css')) continue;
    if (!/\.(?:astro|css|mjs|ts|tsx|js)$/.test(entry.name)) continue;
    for (const [index, line] of readFileSync(path, 'utf8').split('\n').entries()) {
      // Ignore comments that quote the name of the canonical colour file.
      if (/#[0-9a-fA-F]{6}\b/.test(line) && !line.includes('theme.css')) {
        strayHex.push(`${relative(root, path)}:${index + 1}:${line.trim()}`);
      }
    }
  }
}
inspect(join(root, 'src'));
inspect(join(root, 'scripts'));

if (strayHex.length > 0) {
  console.log('\nHex values found outside src/styles/theme.css:\n');
  console.log(strayHex.join('\n'));
  failures.push(`${strayHex.length} hardcoded hex value(s) outside theme.css`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} accessibility check(s) failed.`);
  process.exit(1);
}

console.log('\nAll contrast pairs pass AA. No hex values outside theme.css.');
