// Contact messages. Pre-launch, with no transactional email wired up yet,
// messages are appended to a file so nothing is lost; forward them to a real
// inbox by exporting, or wire SMTP later. Same NDJSON approach as the waitlist.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.ROOK_DATA_DIR || path.join(__dirname, '..', '..', 'data');
const FILE = path.join(DATA_DIR, 'messages.ndjson');
fs.mkdirSync(DATA_DIR, { recursive: true });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function addMessage({ name, email, subject, message, company }) {
  // Honeypot: real people leave "company" empty.
  if (company) return { ok: true, spam: true };
  const e = String(email || '').trim();
  const m = String(message || '').trim();
  if (!EMAIL_RE.test(e) || m.length < 2) return { ok: false };
  const record = {
    name: String(name || '').slice(0, 120),
    email: e.toLowerCase().slice(0, 254),
    subject: String(subject || '').slice(0, 120),
    message: m.slice(0, 4000),
    at: new Date().toISOString(),
  };
  fs.appendFileSync(FILE, JSON.stringify(record) + '\n', 'utf8');
  return { ok: true };
}
