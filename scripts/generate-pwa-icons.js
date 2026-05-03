import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const chunk = Buffer.concat([len, typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(chunk.slice(4)), 0);
  return Buffer.concat([chunk, crc]);
}

function createPng(width, height, drawPixel) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const idx = rowStart + 1 + x * 4;
      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
      raw[idx + 3] = a;
    }
  }

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', (() => {
      const b = Buffer.alloc(13);
      b.writeUInt32BE(width, 0);
      b.writeUInt32BE(height, 4);
      b[8] = 8;
      b[9] = 6;
      b[10] = 0;
      b[11] = 0;
      b[12] = 0;
      return b;
    })()),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);

  return png;
}

function makeIcon(width, height) {
  return createPng(width, height, (x, y, w, h) => {
    const t = y / (h - 1);
    const r = Math.round(10 + (18 - 10) * t);
    const g = Math.round(92 + (150 - 92) * t);
    const b = Math.round(74 + (122 - 74) * t);
    let rr = r;
    let gg = g;
    let bb = b;
    const cx = w / 2;
    const cy = h / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 0.75) {
      const factor = (0.75 - d) / 0.75;
      rr = Math.round(rr + (255 - rr) * factor * 0.15);
      gg = Math.round(gg + (255 - gg) * factor * 0.08);
      bb = Math.round(bb + (255 - bb) * factor * 0.12);
    }
    const pillWidth = w * 0.42;
    const pillHeight = h * 0.28;
    const rx = pillWidth / 2;
    const ry = pillHeight / 2;
    const dx2 = x - cx;
    const dy2 = y - cy;
    const pill = Math.pow((Math.abs(dx2) - pillWidth / 2) / rx, 2) + Math.pow(dy2 / ry, 2);
    if (pill <= 1) return [255, 255, 255, 255];
    const cross = (Math.abs(x - cx) < w * 0.04 && Math.abs(y - cy) < h * 0.14) ||
                  (Math.abs(y - cy) < h * 0.04 && Math.abs(x - cx) < w * 0.14);
    if (cross) return [255, 255, 255, 255];
    return [rr, gg, bb, 255];
  });
}

function makeSplash(width, height) {
  return createPng(width, height, (x, y, w, h) => {
    const t = y / (h - 1);
    const r = Math.round(10 + (18 - 10) * t);
    const g = Math.round(92 + (150 - 92) * t);
    const b = Math.round(74 + (122 - 74) * t);
    let rr = r;
    let gg = g;
    let bb = b;
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy) / Math.max(w, h);
    if (d < 0.45) {
      rr = Math.round(rr + (255 - rr) * 0.12);
      gg = Math.round(gg + (255 - gg) * 0.08);
      bb = Math.round(bb + (255 - bb) * 0.1);
    }
    const iconSize = Math.min(w, h) * 0.24;
    const px = x - cx;
    const py = y - cy;
    const pill = Math.pow((Math.abs(px) - iconSize * 0.5) / (iconSize * 0.5), 2) + Math.pow(py / (iconSize * 0.3), 2);
    if (pill <= 1) return [255, 255, 255, 255];
    if (Math.abs(y - (cy + iconSize * 1.1)) < h * 0.008 && Math.abs(x - cx) < w * 0.18) {
      return [255, 255, 255, 255];
    }
    return [rr, gg, bb, 255];
  });
}

const assets = [
  { name: 'public/icon-192.png', width: 192, height: 192, splash: false },
  { name: 'public/icon-512.png', width: 512, height: 512, splash: false },
  { name: 'public/apple-touch-icon.png', width: 180, height: 180, splash: false },
  { name: 'public/apple-splash-1170x2532.png', width: 1170, height: 2532, splash: true },
  { name: 'public/apple-splash-2048x2732.png', width: 2048, height: 2732, splash: true },
];

for (const asset of assets) {
  const data = asset.splash ? makeSplash(asset.width, asset.height) : makeIcon(asset.width, asset.height);
  fs.writeFileSync(path.resolve(process.cwd(), asset.name), data);
  console.log(`wrote ${asset.name} (${data.length} bytes)`);
}

