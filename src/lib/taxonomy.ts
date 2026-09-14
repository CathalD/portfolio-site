/* Read the owner-maintained taxonomy. The validator checks its membership and shape. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

export interface TagDefinition {
  slug: string;
  label: string;
  description?: string;
  group?: string;
}

export function getTags(): TagDefinition[] {
  const source = readFileSync(join(process.cwd(), 'content/data/tags.yaml'), 'utf8');
  const data = parseYaml(source) as { tags?: TagDefinition[] } | null;
  return data?.tags ?? [];
}

export function tagLabel(slug: string, tags: TagDefinition[]): string {
  return tags.find((tag) => tag.slug === slug)?.label ?? slug;
}
