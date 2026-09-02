// Build-time only: generates public/img/share.png (1200x630 OG/share card)
// from the brand mark + Raleway. Run: node .build/make-share.mjs
import * as PImage from 'pureimage';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const W = 1200, H = 630;
const BLACK = '#0A0A0A', GOLD = '#B8985A', GOLD2 = '#CBB074', WHITE = '#F2EFE8', MUTE = '#9E9E9E';

const font = PImage.registerFont(path.join(dir, 'raleway-var.ttf'), 'Raleway');
font.loadSync();

const img = PImage.make(W, H);
const ctx = img.getContext('2d');

// Ground
ctx.fillStyle = BLACK;
ctx.fillRect(0, 0, W, H);

// Thin gold frame
ctx.strokeStyle = GOLD;
ctx.lineWidth = 2;
ctx.strokeRect(24, 24, W - 48, H - 48);

// The gold mark on the left
const mark = PImage.decodePNGFromStream(fs.createReadStream(path.join(dir, 'mark.png')));
const run = async () => {
  const m = await mark;
  const size = 360;
  ctx.drawImage(m, 0, 0, m.width, m.height, 96, (H - size) / 2, size, size);

  // Wordmark + tagline on the right
  const x = 520;
  ctx.fillStyle = WHITE;
  ctx.font = '150pt Raleway';
  ctx.fillText('ROOK', x, 300);

  // gold rule
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + 4, 330, 150, 4);

  ctx.fillStyle = GOLD2;
  ctx.font = '30pt Raleway';
  ctx.fillText('NIC SALT E-LIQUID', x + 4, 392);

  ctx.fillStyle = MUTE;
  ctx.font = '26pt Raleway';
  ctx.fillText('Made in South Africa', x + 4, 436);

  const out = path.join(dir, '..', 'public', 'img', 'share.png');
  await PImage.encodePNGToStream(img, fs.createWriteStream(out));
  console.log('wrote', out);
};
run().catch((e) => { console.error(e); process.exit(1); });
