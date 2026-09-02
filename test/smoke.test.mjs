// Smoke tests. Build the app in-memory and exercise routes with inject() — no
// network, no port. Run: npm test
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

// Isolate file writes to a temp dir; must be set before importing the app.
const DATA = path.join(os.tmpdir(), 'rook-test-' + process.pid + '-' + Date.now());
process.env.ROOK_DATA_DIR = DATA;
process.env.ROOK_SECRET = 'test-secret-key-abcdefghijklmnop';
delete process.env.NODE_ENV; // keep dev behaviour (nogate bypass)

const { buildApp } = await import('../src/app.js');
const app = await buildApp({ logger: false });
after(async () => { await app.close(); fs.rmSync(DATA, { recursive: true, force: true }); });

test('home shows the age gate when not verified', async () => {
  const r = await app.inject({ method: 'GET', url: '/' });
  assert.equal(r.statusCode, 200);
  assert.match(r.body, /This site is for adults/);
});

test('nogate bypass reveals content in dev', async () => {
  const r = await app.inject({ method: 'GET', url: '/?nogate=1' });
  assert.match(r.body, /Flavour that holds up/i);
  assert.doesNotMatch(r.body, /This site is for adults/);
});

test('all main pages return 200', async () => {
  const urls = ['/', '/shop/', '/flavours/', '/about/', '/help/', '/contact/',
    '/wholesale/', '/age-policy/', '/terms/', '/privacy/', '/journal/',
    '/product/black-ice/', '/journal/the-three-week-test/', '/sitemap.xml', '/robots.txt', '/health'];
  for (const url of urls) {
    const r = await app.inject({ method: 'GET', url });
    assert.equal(r.statusCode, 200, `${url} should be 200`);
  }
});

test('unknown product and article are 404', async () => {
  assert.equal((await app.inject({ url: '/product/nope/' })).statusCode, 404);
  assert.equal((await app.inject({ url: '/journal/nope/' })).statusCode, 404);
  assert.equal((await app.inject({ url: '/totally-missing/' })).statusCode, 404);
});

test('security header is present', async () => {
  const r = await app.inject({ url: '/?nogate=1' });
  assert.equal(r.headers['x-content-type-options'], 'nosniff');
});

test('sitemap lists product + journal URLs', async () => {
  const r = await app.inject({ url: '/sitemap.xml' });
  assert.match(r.body, /\/product\/cherry-ice\//);
  assert.match(r.body, /\/journal\/what-cold-actually-means\//);
});

test('age gate: adult DOB sets the cookie and lets you in', async () => {
  const r = await app.inject({ method: 'POST', url: '/gate', payload: { d: '15', m: '6', y: '1990' } });
  assert.equal(r.statusCode, 303);
  const cookie = r.cookies.find((c) => c.name === 'rook_age');
  assert.ok(cookie, 'sets rook_age cookie');
  // that cookie should now bypass the gate
  const home = await app.inject({ url: '/', cookies: { rook_age: cookie.value } });
  assert.doesNotMatch(home.body, /This site is for adults/);
});

test('age gate: underage is refused', async () => {
  const r = await app.inject({ method: 'POST', url: '/gate', payload: { d: '15', m: '6', y: '2015' } });
  assert.equal(r.statusCode, 200);
  assert.match(r.body, /18 or older/);
  assert.equal(r.cookies.find((c) => c.name === 'rook_age'), undefined);
});

test('signup: valid stores and returns ok', async () => {
  const r = await app.inject({
    method: 'POST', url: '/signup',
    headers: { 'x-requested-with': 'fetch' },
    payload: { email: 'real@example.com', source: 'test' },
  });
  assert.deepEqual(JSON.parse(r.body).ok, true);
  const file = path.join(DATA, 'subscribers.ndjson');
  assert.match(fs.readFileSync(file, 'utf8'), /real@example\.com/);
});

test('signup: invalid email is rejected', async () => {
  const r = await app.inject({
    method: 'POST', url: '/signup',
    headers: { 'x-requested-with': 'fetch' },
    payload: { email: 'not-an-email' },
  });
  assert.equal(JSON.parse(r.body).ok, false);
});

test('signup: honeypot pretends success but stores nothing', async () => {
  const file = path.join(DATA, 'subscribers.ndjson');
  const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const r = await app.inject({
    method: 'POST', url: '/signup',
    headers: { 'x-requested-with': 'fetch' },
    payload: { email: 'bot@spam.com', company: 'BotCorp' },
  });
  assert.equal(JSON.parse(r.body).ok, true);
  const afterText = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  assert.equal(afterText, before, 'honeypot submission is not stored');
  assert.doesNotMatch(afterText, /bot@spam\.com/);
});

test('contact: valid message stored, invalid rejected', async () => {
  const ok = await app.inject({
    method: 'POST', url: '/contact',
    headers: { 'x-requested-with': 'fetch' },
    payload: { email: 'c@example.com', message: 'A real question' },
  });
  assert.equal(JSON.parse(ok.body).ok, true);
  const bad = await app.inject({
    method: 'POST', url: '/contact',
    headers: { 'x-requested-with': 'fetch' },
    payload: { email: 'c@example.com', message: '' },
  });
  assert.equal(JSON.parse(bad.body).ok, false);
});
