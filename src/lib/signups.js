// Waitlist storage. Pre-launch, the only thing the site captures is email
// addresses for the launch list, so they are appended to a newline-delimited
// JSON file. No database to provision, and it survives a redeploy because the
// file lives outside the app source (set ROOK_DATA_DIR on the server to a path
// that is NOT wiped on deploy). Export it to a real sending platform later.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.ROOK_DATA_DIR || path.join(__dirname, '..', '..', 'data');
const FILE = path.join(DATA_DIR, 'subscribers.ndjson');

fs.mkdirSync(DATA_DIR, { recursive: true });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validEmail(email) {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email.trim());
}

// Append one subscriber. Deliberately does not de-duplicate on write (that would
// mean reading the whole file under load); dedupe on export instead.
export function addSubscriber(email, source = 'site') {
  const record = {
    email: String(email).trim().toLowerCase(),
    source: String(source).slice(0, 40),
    at: new Date().toISOString(),
  };
  fs.appendFileSync(FILE, JSON.stringify(record) + '\n', 'utf8');
  return record;
}

export function count() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8').trim();
    if (!raw) return 0;
    return new Set(raw.split('\n').map((l) => {
      try { return JSON.parse(l).email; } catch { return l; }
    })).size;
  } catch {
    return 0;
  }
}
