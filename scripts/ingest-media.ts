/*
 * Create web derivatives and draft gallery sidecars from local originals.
 * Sharp removes EXIF (including GPS) by default because no withMetadata call
 * is made. Originals are only read, never modified or deleted.
 */
import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';
import { ROOT } from './lib/content-files.ts';

const inbox = join(ROOT, 'content/gallery/_inbox');
const contentDir = join(ROOT, 'content/gallery');
const imageDir = join(ROOT, 'public/images/gallery');
const widths = [480, 960, 1600, 2400];
const extensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);

if (!existsSync(inbox)) {
  console.error(
    'Gallery inbox is missing. Create content/gallery/_inbox/ and put photographs there.',
  );
  process.exit(1);
}

const files = readdirSync(inbox).filter((name) => extensions.has(extname(name).toLowerCase()));
if (files.length === 0) {
  console.log('Gallery inbox is empty. Nothing to ingest.');
  process.exit(0);
}

function slugFor(name: string): string {
  return basename(name, extname(name))
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

for (const file of files) {
  const slug = slugFor(file);
  if (!slug) {
    throw new Error(`Could not derive a URL slug from ${file}. Rename the file first.`);
  }
  const sidecar = join(contentDir, `${slug}.md`);
  const output = join(imageDir, slug);
  if (existsSync(sidecar) || existsSync(output)) {
    throw new Error(
      `${slug} already exists. Nothing was overwritten; rename the input if it is new.`,
    );
  }

  const input = join(inbox, file);
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`${file} has no readable image dimensions.`);
  }

  mkdirSync(output, { recursive: true });
  for (const width of widths) {
    await sharp(input)
      .rotate()
      .resize({ width })
      .webp({ quality: 82 })
      .toFile(join(output, `image-${width}.webp`));
    await sharp(input)
      .rotate()
      .resize({ width })
      .avif({ quality: 55 })
      .toFile(join(output, `image-${width}.avif`));
  }

  const source = `---\ntitle: 'TODO(cathal): title'\nalt: 'TODO(cathal): describe what the image shows'\nmediaType: image\nsrc: '/images/gallery/${slug}/image-1600.webp'\ndraft: true\n---\n`;
  writeFileSync(sidecar, source, { flag: 'wx' });
  console.log(`${file} → content/gallery/${slug}.md (draft; original left in the inbox)`);
}
