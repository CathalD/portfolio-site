/*
 * reading-time.ts — estimate how long a piece of writing takes to read.
 *
 * WHY THIS IS NOT A FRONTMATTER FIELD: a hand-entered reading time goes stale
 * the moment the post is edited, and nobody remembers to update it. Computing
 * it from the actual text means it cannot drift. `readingTime` is therefore
 * absent from the Zod schema on purpose — writing it in frontmatter does
 * nothing.
 *
 * WHY THIS IS NOT A MARKDOWN PLUGIN: Astro 7 replaced unified/remark as the
 * default Markdown processor, and hooking into the new one would mean
 * installing a compatibility package and coupling this site to whichever
 * engine is current. Counting words in the raw Markdown source is engine-
 * independent and will still work in ten years. It is also accurate enough:
 * the number is rounded to whole minutes.
 *
 * Usage:
 *   import { readingTime } from '../lib/reading-time.ts';
 *   readingTime(entry.body ?? '')   // -> number, in minutes
 */

/** Words per minute. 200 is the conventional figure for adult prose. */
const WORDS_PER_MINUTE = 200;

/**
 * Strip the Markdown constructs that are not read as prose, so a post that is
 * mostly a code listing is not reported as a forty-minute read.
 */
function toPlainText(markdown: string): string {
  return (
    markdown
      // Fenced code blocks.
      .replace(/^```[\s\S]*?^```/gm, ' ')
      // Indented code blocks.
      .replace(/^(?: {4}|\t).*$/gm, ' ')
      // Inline code.
      .replace(/`[^`\n]*`/g, ' ')
      // HTML comments (used for TODO(cathal) notes) and tags.
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<\/?[a-zA-Z][^>]*>/g, ' ')
      // Images: alt text is not read as body prose.
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      // Links: keep the label, drop the URL.
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Reference definitions and bare URLs.
      .replace(/^\s*\[[^\]]+\]:.*$/gm, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      // Heading markers, blockquote markers, list bullets, emphasis, rules.
      .replace(/^\s{0,3}#{1,6}\s+/gm, ' ')
      .replace(/^\s*>+\s?/gm, ' ')
      .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, ' ')
      .replace(/^\s*(?:[-*_]\s*){3,}$/gm, ' ')
      .replace(/[*_~]+/g, '')
      // Table pipes.
      .replace(/\|/g, ' ')
  );
}

export function countWords(markdown: string): number {
  return (
    toPlainText(markdown)
      .split(/\s+/u)
      // A "word" needs at least one letter or digit; stray punctuation does not count.
      .filter((token) => /[\p{L}\p{N}]/u.test(token)).length
  );
}

/** Reading time in whole minutes, never less than 1. */
export function readingTime(markdown: string): number {
  return Math.max(1, Math.round(countWords(markdown) / WORDS_PER_MINUTE));
}
