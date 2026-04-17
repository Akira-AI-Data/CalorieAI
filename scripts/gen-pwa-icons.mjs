// Generate PWA icons: white Sparkles on #1E3F20 rounded square
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'icons')
mkdirSync(OUT, { recursive: true })

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

// Lucide Sparkles SVG path (stroke-based)
const sparklesSvg = (size) => {
  const pad = Math.round(size * 0.22)
  const iconSize = size - pad * 2
  const radius = Math.round(size * 0.22)
  const stroke = Math.max(2, Math.round(size * 0.045))
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#1E3F20"/>
  <g transform="translate(${pad}, ${pad}) scale(${iconSize / 24})" fill="none" stroke="white" stroke-width="${(stroke * 24) / iconSize}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/>
    <path d="M22 5h-4"/>
    <path d="M4 17v2"/>
    <path d="M5 18H3"/>
  </g>
</svg>`
}

for (const size of SIZES) {
  const svg = sparklesSvg(size)
  const out = join(OUT, `icon-${size}x${size}.png`)
  await sharp(Buffer.from(svg)).png().toFile(out)
  console.log(`wrote ${out}`)
}

// Favicon 48x48
await sharp(Buffer.from(sparklesSvg(48))).png().toFile(join(__dirname, '..', 'public', 'favicon.png'))
console.log('wrote favicon.png')
