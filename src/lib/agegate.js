// Self-declared 18+ age gate. A visitor who confirms their date of birth gets
// an HMAC-signed cookie so the gate does not reappear on every page. The cookie
// only asserts "this browser passed the gate"; it stores no personal data.
//
// Signing key comes from ROOK_SECRET in the environment. Falls back to a fixed
// dev key so the site runs locally without setup — set a real one in production.

import crypto from 'node:crypto';

const SECRET = process.env.ROOK_SECRET || 'rook-dev-key-change-me';
const COOKIE = 'rook_age';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const MIN_AGE = 18;

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('base64url');
}

// Issue the cookie value: "<issuedAt>.<signature>".
export function issue() {
  const issued = Math.floor(Date.now() / 1000).toString();
  return `${issued}.${sign(issued)}`;
}

// Verify a cookie value with a constant-time comparison.
export function verify(raw) {
  if (!raw || typeof raw !== 'string') return false;
  const [issued, sig] = raw.split('.');
  if (!issued || !sig) return false;
  const expected = sign(issued);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const age = Math.floor(Date.now() / 1000) - Number(issued);
  return age >= 0 && age <= MAX_AGE;
}

// Is the given day/month/year an adult, and a real date?
export function isAdult(d, m, y) {
  d = Number(d); m = Number(m); y = Number(y);
  if (!d || !m || !y || String(y).length !== 4) return { ok: false, reason: 'incomplete' };
  const dob = new Date(y, m - 1, d);
  if (dob.getFullYear() !== y || dob.getMonth() !== m - 1 || dob.getDate() !== d) {
    return { ok: false, reason: 'invalid' };
  }
  const today = new Date();
  let age = today.getFullYear() - y;
  const mo = today.getMonth() - (m - 1);
  if (mo < 0 || (mo === 0 && today.getDate() < d)) age--;
  if (age < MIN_AGE) return { ok: false, reason: 'under' };
  if (age > 120) return { ok: false, reason: 'invalid' };
  return { ok: true };
}

export const cookieName = COOKIE;
export const cookieMaxAge = MAX_AGE;
