// Rebuilds the scroll-scrubbed hero frame sequences from a drone clip.
//
// Usage: node scripts/build-hero-sequence.mjs <path-to-video.mp4> [seconds=36] [frames=150]
//
// Source used on the site: Pexels video 27682586 ("Aerial view of the castle",
// Pexels License — free for commercial use). Download the 1920×1080 file from
// https://www.pexels.com/video/aerial-view-of-the-castle-27682586/ and pass it in.
//
// Output: public/assets/sequences/hero-flight/{desktop 1280×720, mobile 640×854}/fNNN.avif
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'
import sharp from 'sharp'

const [, , video, seconds = '36', frames = '150'] = process.argv
if (!video) {
  console.error('Usage: node scripts/build-hero-sequence.mjs <video.mp4> [seconds] [frames]')
  process.exit(1)
}
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = join(root, 'public/assets/sequences/hero-flight')

const variants = [
  { name: 'desktop', vf: 'scale=1280:-2:flags=lanczos', quality: 42 },
  { name: 'mobile', vf: 'crop=ih*0.75:ih,scale=640:-2:flags=lanczos', quality: 40 }, // 3:4 portrait crop
]

for (const v of variants) {
  const tmp = mkdtempSync(join(tmpdir(), `hero-${v.name}-`))
  execFileSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-t', seconds, '-i', video,
    '-vf', `fps=${frames}/${seconds},hqdn3d=2:2:3:3,${v.vf}`,
    '-frames:v', frames, join(tmp, 'f%03d.png'),
  ])
  const out = join(outRoot, v.name)
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  let bytes = 0
  for (const f of readdirSync(tmp).sort()) {
    const info = await sharp(join(tmp, f)).avif({ quality: v.quality, effort: 4 }).toFile(join(out, f.replace('.png', '.avif')))
    bytes += info.size
  }
  rmSync(tmp, { recursive: true, force: true })
  console.log(`${v.name}: ${readdirSync(out).length} frames, ${(bytes / 1048576).toFixed(1)} MB`)
}
