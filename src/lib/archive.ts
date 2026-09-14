/* Archive is a view over published content; entries never move or lose URLs. */
import { getPublished } from './content.ts';

export interface ArchiveEntry {
  title: string;
  href: string;
  year: number;
  type: 'Project' | 'Writing' | 'Gallery';
  archived: boolean;
}

export async function getArchiveEntries(): Promise<ArchiveEntry[]> {
  const [projects, writing, gallery] = await Promise.all([
    getPublished('projects'),
    getPublished('writing'),
    getPublished('gallery'),
  ]);
  return [
    ...projects.map((entry) => ({
      title: entry.data.title,
      href: `/projects/${entry.id}/`,
      year: entry.data.year,
      type: 'Project' as const,
      archived: entry.data.status === 'archived',
    })),
    ...writing.map((entry) => ({
      title: entry.data.title,
      href: `/writing/${entry.id}/`,
      year: entry.data.publishedAt.getUTCFullYear(),
      type: 'Writing' as const,
      archived: false,
    })),
    ...gallery.map((entry) => ({
      title: entry.data.title,
      href: `/gallery/${entry.id}/`,
      year: entry.data.capturedAt?.getUTCFullYear() ?? 0,
      type: 'Gallery' as const,
      archived: false,
    })),
  ].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function archiveYears(entries: ArchiveEntry[]): number[] {
  return [...new Set(entries.map((entry) => entry.year))].sort((a, b) => b - a);
}
