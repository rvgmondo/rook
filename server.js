// ROOK — Fastify server. Server-renders the site, gates it behind a self-
// declared 18+ check, and captures the pre-launch waitlist. No database.
//
// cPanel: set this file as the app's startup file. Passenger passes a port in
// process.env.PORT; locally it defaults to 3000.

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyCompress from '@fastify/compress';
import fastifyRateLimit from '@fastify/rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { issue, verify, isAdult, cookieName, cookieMaxAge } from './src/lib/agegate.js';
import { addSubscriber, validEmail } from './src/lib/signups.js';
import { addMessage } from './src/lib/messages.js';
import { homePage } from './src/pages/home.js';
import { contentPage, flavoursPage, contactPage } from './src/pages/page.js';
import { shopPage } from './src/pages/shop.js';
import { productPage } from './src/pages/product.js';
import { journalIndex, journalArticle } from './src/pages/journal.js';
import { notFoundPage, errorPage } from './src/render.js';
import { sitemapXml, robotsTxt } from './src/lib/seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = Fastify({ trustProxy: true });

await app.register(fastifyCompress, { global: true, encodings: ['br', 'gzip'] });
await app.register(fastifyRateLimit, {
  global: false, // opt in per route; page views are not limited
  max: 12, timeWindow: '1 minute',
});
await app.register(fastifyCookie);
await app.register(fastifyFormbody);
await app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/',
  wildcard: false,
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
});

const html = (reply, markup) => reply.type('text/html; charset=utf-8').send(markup);
const DEV = process.env.NODE_ENV !== 'production';
const gated = (req) => {
  if (DEV && req.query.nogate === '1') return false; // dev-only preview bypass
  return !verify(req.cookies[cookieName]);
};

// Security headers on every response.
app.addHook('onSend', async (req, reply, payload) => {
  reply.headers({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  });
  return payload;
});

// --- Home --------------------------------------------------------------------
app.get('/', async (req, reply) =>
  html(reply, homePage({ gated: gated(req), signup: req.query.signup })));

// --- Content + listing pages -------------------------------------------------
const send404 = (req, reply) =>
  reply.code(404).type('text/html; charset=utf-8').send(notFoundPage({ gated: gated(req) }));

app.get('/shop/', async (req, reply) => html(reply, shopPage({ gated: gated(req) })));
app.get('/flavours/', async (req, reply) => html(reply, flavoursPage({ gated: gated(req) })));
app.get('/contact/', async (req, reply) =>
  html(reply, contactPage({ gated: gated(req), status: req.query.contact })));

for (const key of ['about', 'help', 'wholesale', 'age-policy', 'terms', 'privacy']) {
  app.get(`/${key}/`, async (req, reply) => html(reply, contentPage(key, { gated: gated(req) })));
}

app.get('/product/:slug/', async (req, reply) => {
  const page = productPage(req.params.slug, { gated: gated(req) });
  return page ? html(reply, page) : send404(req, reply);
});

// Journal
app.get('/journal/', async (req, reply) => html(reply, journalIndex({ gated: gated(req) })));
app.get('/journal/:slug/', async (req, reply) => {
  const page = journalArticle(req.params.slug, { gated: gated(req) });
  return page ? html(reply, page) : send404(req, reply);
});

// --- SEO files ---------------------------------------------------------------
app.get('/sitemap.xml', async (req, reply) =>
  reply.type('application/xml; charset=utf-8').send(sitemapXml()));
app.get('/robots.txt', async (req, reply) =>
  reply.type('text/plain; charset=utf-8').send(robotsTxt()));

// Anything unmatched -> styled 404.
app.setNotFoundHandler((req, reply) => send404(req, reply));

// Error handler: respect the error's own status code.
app.setErrorHandler((err, req, reply) => {
  const code = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  if (code === 429) {
    return reply.code(429).type('text/plain; charset=utf-8')
      .send('Too many requests. Please wait a minute and try again.');
  }
  if (code >= 500) {
    req.log.error(err);
    return reply.code(500).type('text/html; charset=utf-8').send(errorPage());
  }
  return reply.code(code).type('text/plain; charset=utf-8').send(err.message || 'Bad request');
});

// --- Contact message ---------------------------------------------------------
app.post('/contact', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (req, reply) => {
  const wantsJson = req.headers['x-requested-with'] === 'fetch';
  const res = addMessage(req.body || {});
  const message = res.ok
    ? 'Thanks. A person reads all of it and will get back to you, usually within one working day.'
    : 'Please add your email and a message so we can reply.';
  if (wantsJson) return reply.send({ ok: res.ok, message });
  return reply.redirect(`/contact/?contact=${res.ok ? 'ok' : 'invalid'}`, 303);
});

// --- Age gate ----------------------------------------------------------------
app.post('/gate', { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } }, async (req, reply) => {
  const { d, m, y } = req.body || {};
  const check = isAdult(d, m, y);
  if (check.ok) {
    reply.setCookie(cookieName, issue(), {
      path: '/', httpOnly: true, sameSite: 'lax',
      secure: req.protocol === 'https', maxAge: cookieMaxAge,
    });
    return reply.redirect('/', 303);
  }
  // Re-render the home behind the gate, with the reason shown.
  return html(reply, homePage({ gated: true, gateError: check.reason }));
});

// --- Waitlist signup ---------------------------------------------------------
app.post('/signup', { config: { rateLimit: { max: 8, timeWindow: '1 minute' } } }, async (req, reply) => {
  const { email, source, company } = req.body || {};
  const wantsJson = req.headers['x-requested-with'] === 'fetch';
  // Honeypot: bots fill the hidden "company" field. Pretend success, store nothing.
  const spam = !!company;
  const ok = spam || validEmail(email);
  if (ok && !spam) addSubscriber(email, source || 'site');

  const message = ok
    ? 'You are on the list. Look out for a note when the next batch lands.'
    : 'That email does not look right. Give it another go.';

  if (wantsJson) return reply.send({ ok, message });

  const back = (req.headers.referer && req.headers.referer.startsWith('http')) ? req.headers.referer : '/';
  const sep = back.includes('?') ? '&' : '?';
  return reply.redirect(`${back}${sep}signup=${ok ? 'ok' : 'invalid'}#signup`, 303);
});

// --- Health + placeholder routes for pages still being built -----------------
app.get('/health', async () => ({ ok: true }));

// Loud warning if the age-gate signing key is missing/weak in production —
// a weak key means the 18+ cookie can be forged.
if (process.env.NODE_ENV === 'production' &&
    (!process.env.ROOK_SECRET || process.env.ROOK_SECRET.length < 16)) {
  app.log.warn('ROOK_SECRET is missing or too short. Set a long random value so the age-gate cookie is securely signed.');
}

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen({ port: PORT, host: HOST })
  .then((addr) => app.log.info(`ROOK running at ${addr}`))
  .catch((err) => { app.log.error(err); process.exit(1); });
