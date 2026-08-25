// ROOK — Fastify server. Server-renders the site, gates it behind a self-
// declared 18+ check, and captures the pre-launch waitlist. No database.
//
// cPanel: set this file as the app's startup file. Passenger passes a port in
// process.env.PORT; locally it defaults to 3000.

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { issue, verify, isAdult, cookieName, cookieMaxAge } from './src/lib/agegate.js';
import { addSubscriber, validEmail } from './src/lib/signups.js';
import { addMessage } from './src/lib/messages.js';
import { homePage } from './src/pages/home.js';
import { contentPage, flavoursPage, contactPage } from './src/pages/page.js';
import { shopPage } from './src/pages/shop.js';
import { productPage } from './src/pages/product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = Fastify({ trustProxy: true });

await app.register(fastifyCookie);
await app.register(fastifyFormbody);
await app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/',
  wildcard: false,
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
});

const html = (reply, markup) => reply.type('text/html; charset=utf-8').send(markup);
const gated = (req) => !verify(req.cookies[cookieName]);

// --- Home --------------------------------------------------------------------
app.get('/', async (req, reply) => html(reply, homePage({ gated: gated(req) })));

// --- Content + listing pages -------------------------------------------------
const send404 = (reply) =>
  reply.code(404).type('text/html; charset=utf-8').send(contentPage('__404__') || 'Not found');

app.get('/shop/', async (req, reply) => html(reply, shopPage({ gated: gated(req) })));
app.get('/flavours/', async (req, reply) => html(reply, flavoursPage({ gated: gated(req) })));
app.get('/contact/', async (req, reply) =>
  html(reply, contactPage({ gated: gated(req), status: req.query.contact })));

for (const key of ['about', 'help', 'wholesale', 'age-policy', 'terms', 'privacy']) {
  app.get(`/${key}/`, async (req, reply) => html(reply, contentPage(key, { gated: gated(req) })));
}

app.get('/product/:slug/', async (req, reply) => {
  const page = productPage(req.params.slug, { gated: gated(req) });
  return page ? html(reply, page) : send404(reply);
});

// Journal: a light placeholder for now.
app.get('/journal/', async (req, reply) => {
  const body = `<header class="phead"><div class="wrap"><nav class="crumbs"><a href="/">ROOK</a><span>/</span><span>Journal</span></nav><h1 class="phead__title h1">Journal</h1><p class="phead__lede lede">Notes on flavour, hardware and the launch. Coming soon.</p></div></header>`;
  const { layout } = await import('./src/render.js');
  return html(reply, layout({ title: 'Journal', description: 'Notes from ROOK.', body, gated: gated(req) }));
});

// --- Contact message ---------------------------------------------------------
app.post('/contact', async (req, reply) => {
  const wantsJson = req.headers['x-requested-with'] === 'fetch';
  const res = addMessage(req.body || {});
  const message = res.ok
    ? 'Thanks. A person reads all of it and will get back to you, usually within one working day.'
    : 'Please add your email and a message so we can reply.';
  if (wantsJson) return reply.send({ ok: res.ok, message });
  return reply.redirect(`/contact/?contact=${res.ok ? 'ok' : 'invalid'}`, 303);
});

// --- Age gate ----------------------------------------------------------------
app.post('/gate', async (req, reply) => {
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
app.post('/signup', async (req, reply) => {
  const { email, source } = req.body || {};
  const wantsJson = req.headers['x-requested-with'] === 'fetch';
  const ok = validEmail(email);
  if (ok) addSubscriber(email, source || 'site');

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

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen({ port: PORT, host: HOST })
  .then((addr) => app.log.info(`ROOK running at ${addr}`))
  .catch((err) => { app.log.error(err); process.exit(1); });
