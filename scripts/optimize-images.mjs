// Re-encodes every WebP in public/assets/images with sharp (q72, effort 6)
// and keeps the result only when it is smaller. Safe to run repeatedly.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = join(dirname(fileURLToPath(import.meta.url)), '../public/assets/images')
let before = 0, after = 0
for (const e of await readdir(dir, { recursive: true, withFileTypes: true })) {
  if (!e.isFile() || !e.name.endsWith('.webp')) continue
  const p = join(e.parentPath ?? e.path, e.name)
  const src = await readFile(p)
  const out = await sharp(src).webp({ quality: 72, effort: 6, smartSubsample: true }).toBuffer()
  before += src.length
  if (out.length < src.length * 0.97) { await writeFile(p, out); after += out.length } else after += src.length
}
console.log(`total ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`)
