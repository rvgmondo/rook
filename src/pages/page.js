import { layout, esc } from '../render.js';
import { icon } from '../lib/icons.js';
import { pages } from '../data/pages.js';
import { products, price } from '../data/products.js';

function pageHeader(title, lede) {
  return `<header class="phead"><div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span>/</span><span aria-current="page">${esc(title)}</span></nav>
    <h1 class="phead__title h1">${esc(title)}</h1>
    ${lede ? `<p class="phead__lede lede">${esc(lede)}</p>` : ''}
  </div></header>`;
}

const prose = (html) => `<article class="bay"><div class="wrap wrap--read"><div class="prose">${html}</div></div></article>`;

// Standard content page (about, help, wholesale, age-policy, terms, privacy).
export function contentPage(key, { gated } = {}) {
  const p = pages[key];
  if (!p) return null;
  const body = pageHeader(p.title, p.excerpt) + prose(p.body + (p.after || ''));
  return layout({ title: p.title, description: p.excerpt, body, gated, canonical: `https://rookvapes.co.za/${key}/` });
}

// Flavours guide: copy, then the live range as a "pick a direction" list, then more copy.
export function flavoursPage({ gated } = {}) {
  const p = pages.flavours;
  const range = `<h2>Now pick a direction</h2>` + products.map((x) =>
    `<h3><a href="/product/${x.slug}/">${esc(x.name)}</a></h3><p>${esc(x.short)} <strong>${esc(x.strength.replace('nicotine ', ''))}</strong></p>`
  ).join('');
  const body = pageHeader(p.title, p.excerpt) + prose(p.body + range + p.after);
  return layout({ title: p.title, description: p.excerpt, body, gated, canonical: 'https://rookvapes.co.za/flavours/' });
}

// Contact page: copy, a real message form, then direct contacts.
export function contactPage({ gated, status } = {}) {
  const p = pages.contact;
  const note = status === 'ok'
    ? `<p class="notice">Thanks. A person reads all of it and will get back to you, usually within one working day.</p>`
    : (status === 'invalid' ? `<p class="notice notice--error">Please add your email and a message so we can reply.</p>` : '');
  const form = `<form class="cform" method="post" action="/contact" data-contact>
    ${note}
    <div class="field"><label class="field__label" for="c-name">Name</label><input class="input" id="c-name" name="name" autocomplete="name"></div>
    <div class="field"><label class="field__label" for="c-email">Email</label><input class="input" id="c-email" type="email" name="email" autocomplete="email" required></div>
    <div class="field"><label class="field__label" for="c-subject">Subject</label>
      <select class="select" id="c-subject" name="subject">
        <option>A flavour recommendation</option>
        <option>An order</option>
        <option>Stocking ROOK in my shop</option>
        <option>Something else</option>
      </select></div>
    <div class="field"><label class="field__label" for="c-message">Message</label><textarea class="textarea" id="c-message" name="message" required></textarea></div>
    <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
    <button class="btn btn--copper" type="submit">Send ${icon('arrow', 14)}</button>
    <p class="notice notice--error cform__msg" data-contact-msg aria-live="polite" hidden></p>
  </form>`;
  const body = pageHeader(p.title, p.excerpt) + `<article class="bay"><div class="wrap wrap--read"><div class="prose">${p.body}</div>${form}<div class="prose" style="margin-top:var(--s7)">${p.after}</div></div></article>`;
  return layout({ title: p.title, description: p.excerpt, body, gated, canonical: 'https://rookvapes.co.za/contact/' });
}
