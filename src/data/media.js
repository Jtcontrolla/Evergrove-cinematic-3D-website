/**
 * EVERGROVE media manifest
 * ------------------------------------------------------------------
 * Every photograph on the site comes from src/data/images.json — the
 * curated selection (Unsplash License) downloaded by
 * `node scripts/fetch-images.mjs` into /public/assets/images/<group>/
 * as WebP at three responsive widths.
 *
 * To swap a photo: change its `id` (or point `path` at your own files
 * named `<path>-<width>.webp`), re-run the fetch script, done.
 */
import selection from './images.json'

const base = '/assets/images/'

function photo(key) {
  const img = selection.images[key]
  const widths = selection.sizes[img.size]
  return {
    src: `${base}${img.path}-${widths[1]}.webp`,
    srcSet: widths.map((w) => `${base}${img.path}-${w}.webp ${w}w`).join(', '),
    alt: img.alt,
    focus: img.focus, // optional object-position focal point, e.g. '50% 88%'
    source: `https://unsplash.com/photos/${img.id}`,
  }
}

export const media = Object.fromEntries(Object.keys(selection.images).map((k) => [k, photo(k)]))

// Brand + optional motion assets that still need to be supplied by EVERGROVE.
media.logo = { src: null, brief: 'Official EVERGROVE logo (SVG) at /public/media/brand/evergrove-logo.svg' }
media.heroVideo = {
  src: null, // optional aerial drone loop (mp4); when set it plays over the hero photo
  webm: null,
  poster: media.hero.src,
  brief: 'Aerial drone loop of a landscaped estate, 15–25s, 1920px H.264 + WebM',
}
media.landVideo = { src: null, brief: 'Optional drone fly-through of a landscaped estate (10–15s loop)' }

/**
 * 3D models (GLB/GLTF). Place files in /public/models and list them here.
 * When empty, the 3D Botanical Experience renders the procedural specimen.
 */
export const models = {
  specimen: null, // e.g. '/models/monstera.glb'
}
