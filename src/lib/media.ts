/* The sole resolver for gallery media paths; a future CDN changes here. */
export function mediaUrl(src: string): string {
  if (src.startsWith('/') || src.startsWith('https://')) return src;
  throw new Error(`Gallery media path must start with / or https://: ${src}`);
}

export function responsiveSet(src: string, format: 'webp' | 'avif'): string | undefined {
  if (!/\/image-1600\.webp$/.test(src)) return undefined;
  return [480, 960, 1600, 2400]
    .map(
      (width) =>
        `${mediaUrl(src.replace(/image-1600\.webp$/, `image-${width}.${format}`))} ${width}w`,
    )
    .join(', ');
}
