// Bağımlılıksız PNG ikon üretici: `npm run icons`
// Koyu zemin üzerinde yeşil bir dambıl çizer, public/ klasörüne yazar.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(OUT, { recursive: true });

const BG = [11, 15, 20];
const FG = [163, 230, 53];

// Dambıl parçaları, 0..1 koordinatlarında [x0, y0, x1, y1, köşeYarıçapı]
const SHAPES = [
  [0.27, 0.465, 0.73, 0.535, 0.02], // sap
  [0.2, 0.28, 0.3, 0.72, 0.035], // iç plakalar
  [0.7, 0.28, 0.8, 0.72, 0.035],
  [0.11, 0.35, 0.19, 0.65, 0.03], // dış plakalar
  [0.81, 0.35, 0.89, 0.65, 0.03],
];

function inRoundRect(x, y, [x0, y0, x1, y1, r]) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

/** @param size piksel, @param pad içeriğin kenar boşluğu (0..0.5), @param rounded arka plan köşeleri yuvarlak mı */
function render(size, { pad, rounded }) {
  const SS = 4; // süper örnekleme (kenar yumuşatma)
  const px = Buffer.alloc(size * size * 4);
  const bgShape = [0, 0, 1, 1, rounded ? 0.22 : 0];
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      let bgHits = 0;
      let fgHits = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (i + (sx + 0.5) / SS) / size;
          const y = (j + (sy + 0.5) / SS) / size;
          if (!inRoundRect(x, y, bgShape)) continue;
          bgHits++;
          const cx = (x - pad) / (1 - 2 * pad);
          const cy = (y - pad) / (1 - 2 * pad);
          if (SHAPES.some((s) => inRoundRect(cx, cy, s))) fgHits++;
        }
      }
      const total = SS * SS;
      const f = bgHits ? fgHits / bgHits : 0;
      const o = (j * size + i) * 4;
      for (let c = 0; c < 3; c++) px[o + c] = Math.round(BG[c] * (1 - f) + FG[c] * f);
      px[o + 3] = Math.round((bgHits / total) * 255);
    }
  }
  return encodePng(size, px);
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit derinliği
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filtre yok
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const files = {
  'pwa-192.png': render(192, { pad: 0.08, rounded: true }),
  'pwa-512.png': render(512, { pad: 0.08, rounded: true }),
  // Maskable: Android ikonu kırpabilir, içerik güvenli alanda (%80) kalmalı
  'pwa-maskable-512.png': render(512, { pad: 0.2, rounded: false }),
  // iOS köşeleri kendisi yuvarlar, şeffaflık istemez
  'apple-touch-icon.png': render(180, { pad: 0.12, rounded: false }),
};
for (const [name, buf] of Object.entries(files)) {
  writeFileSync(join(OUT, name), buf);
  console.log('yazıldı:', name, buf.length, 'bayt');
}

const rects = SHAPES.map(
  ([x0, y0, x1, y1, r]) =>
    `<rect x="${x0 * 100}" y="${y0 * 100}" width="${(x1 - x0) * 100}" height="${(y1 - y0) * 100}" rx="${r * 100}"/>`,
).join('');
writeFileSync(
  join(OUT, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="rgb(${BG})"/><g fill="rgb(${FG})">${rects}</g></svg>\n`,
);
console.log('yazıldı: favicon.svg');
