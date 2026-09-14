# Adding photographs

Keep full-resolution originals outside this repository for permanent storage.
The temporary `content/gallery/_inbox/` folder is ignored by Git and is only
a working area for photographs you are ready to prepare. Create it if it does
not exist. Never rely on it as your only copy.

To prepare photographs, put JPEG, PNG, WebP, TIFF or AVIF files in that inbox
and run `npm run ingest`. Each filename becomes a permanent gallery slug, so
rename files before ingest if their filenames expose private information or
would make poor URLs. The script refuses to overwrite an existing slug. It
creates responsive AVIF and WebP files in
`public/images/gallery/[slug]/` and a draft sidecar at
`content/gallery/[slug].md`. It does not modify or delete the input.

Open each draft sidecar. Replace the `TODO(cathal)` title and alt text with
your own accurate words; optionally add a caption, date, coarse location,
project slug and tags. Check the generated images visually, then set
`draft: false` and run `npm run check`. The gallery index and detail page
appear automatically. Video is not supported by the gallery yet; adding it
will also require a decision about hosting, captions and transcripts.

The image conversion strips all EXIF metadata, including GPS, by default.
There is no coordinate opt-in in this version. Do not put sensitive locations
in the filename, slug, `location`, or caption either. `location` should be
coarse when used.

If ingest reports that a slug already exists, stop and inspect both the
sidecar and derivative directory. It never overwrites either. If a draft does
not appear on the public site, check `draft`; drafts are preview-only.
