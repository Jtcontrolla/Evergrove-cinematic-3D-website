// Downloads the EVERGROVE image selection (src/data/images.json) from the
// Unsplash CDN as WebP at responsive widths into public/assets/images/.
// Usage: node scripts/fetch-images.mjs   (skips files that already exist)
import { readFile, mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { sizes, images } = JSON.parse(await readFile(join(root, 'src/data/images.json'), 'utf8'))
const outDir = join(root, 'public/assets/images')

const exists = (p) => access(p).then(() => true, () => false)
const report = []

for (const [key, img] of Object.entries(images)) {
  for (const w of sizes[img.size]) {
    const file = join(outDir, `${img.path}-${w}.webp`)
    if (await exists(file)) continue
    const url = `https://images.unsplash.com/photo-${img.id}?w=${w}&q=78&fm=webp&fit=max&auto=format`
    const res = await fetch(url)
    if (!res.ok) {
      report.push(`FAIL ${key} ${w}: HTTP ${res.status}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const meta = await sharp(buf).metadata() // validates it is a real image
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, buf)
    report.push(`ok   ${key.padEnd(15)} ${String(w).padStart(4)}w -> ${meta.width}x${meta.height} ${meta.format} ${(buf.length / 1024).toFixed(0)}KB`)
  }
}
console.log(report.join('\n') || 'All images already present.')
