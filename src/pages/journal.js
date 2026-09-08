// The journal. Two templates and no pictures in either of them.
//
// The index used to be three grey cards standing where hero images were meant
// to go. There is no photography and there is no dated metadata in the data, so
// the honest version of this page is a well set index: three lines, a rule
// between each, the ordinal in the rail. It reads as a set of writing rather
// than as a blog with the images missing.
//
// The article page has one job, which is measure. Everything here is in service
// of a comfortable line length and a clean vertical rhythm.

import { layout, esc, words } from '../render.js';
import { icon } from '../lib/icons.js';
import { ord } from '../lib/components.js';
import { articles, articleBySlug } from '../data/journal.js';

const CANON = 'https://rookvapes.co.za';

const HOME_CRUMB = '<a href="/">ROOK</a><span>/</span>';

// The shared title block. With no hero image to carry the top of the page, the
// air above the h1 is what signals that this is not a shop listing, so the
// generous space between the crumbs and the title is deliberate.
function titleBlock({ crumbs, title, lede, rail = '' }) {
  return `
<header class="phead phead--index"><div class="wrap grid12">
  <nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
  ${rail}
  <h1 class="phead__title">${words(title)}</h1>
  <span class="phead__rule" aria-hidden="true"></span>
  <p class="phead__lede">${esc(lede)}</p>
</div></header>`;
}

// One line of the index. The band carries exactly one anchor and the whole row
// is made clickable by a stretched pseudo-element on it, so tabbing through the
// list gives one stop per article rather than one per element inside it.
//
// `dir` is only passed by the previous and next rows at the foot of an article,
// where the direction is real information and has to be readable, not implied
// by position alone.
function ledgerRow(a, n, { level = 'h2', dir = '' } = {}) {
  return `
      <article class="ledger__row rv">
        <div class="ledger__rail">
          <span class="ord" aria-hidden="true">${esc(ord(n))}</span>
          ${dir ? `<span class="ledger__dir">${esc(dir)}</span>` : ''}
        </div>
        <${level} class="ledger__title"><a href="/journal/${esc(a.slug)}/">${words(a.title)}</a></${level}>
        <p class="ledger__ex">${esc(a.excerpt)}</p>
        <span class="ledger__go" aria-hidden="true">${icon('arrow', 16)}</span>
      </article>`;
}

export function journalIndex({ gated } = {}) {
  const rows = articles.map((a, i) => ledgerRow(a, i + 1)).join('');
  const body = `
${titleBlock({
    crumbs: `${HOME_CRUMB}<span aria-current="page">Journal</span>`,
    title: 'Journal',
    lede: 'Notes on flavour, hardware and how we make the range. No news, no hype.',
  })}
<section class="bay"><div class="wrap">
  <div class="ledger">${rows}
  </div>
</div></section>`;
  return layout({
    title: 'Journal',
    description: 'Notes on flavour, hardware and how ROOK makes its range.',
    body,
    gated,
    plinth: 'journal',
    canonical: `${CANON}/journal/`,
  });
}

export function journalArticle(slug, { gated } = {}) {
  const a = articleBySlug[slug];
  if (!a) return null;

  const i = articles.indexOf(a);

  // Position in the set, standing in for the date this data does not carry.
  // Decorative: the same information is in the index one click away, and read
  // aloud it would only ever be noise between the crumbs and the headline.
  const rail = `
  <p class="phead__ord" aria-hidden="true"><span class="ord">${esc(ord(i + 1))}</span><span class="phead__ord-s">/</span><span class="ord">${esc(ord(articles.length))}</span></p>`;

  // Previous and next wrap around the ends of the list, so the foot of every
  // article offers two ways on and never a dead end.
  const postnav = articles.length > 1 ? `
    <nav class="postnav" aria-labelledby="postnav-h">
      <h2 class="postnav__h" id="postnav-h">Keep reading</h2>
      <div class="ledger">
${ledgerRow(articles[(i - 1 + articles.length) % articles.length], ((i - 1 + articles.length) % articles.length) + 1, { level: 'h3', dir: 'Previous' })}
${ledgerRow(articles[(i + 1) % articles.length], ((i + 1) % articles.length) + 1, { level: 'h3', dir: 'Next' })}
      </div>
    </nav>` : '';

  const body = `
${titleBlock({
    crumbs: `${HOME_CRUMB}<a href="/journal/">Journal</a><span>/</span><span aria-current="page">${esc(a.title)}</span>`,
    title: a.title,
    lede: a.excerpt,
    rail,
  })}
<article class="bay">
  <div class="wrap wrap--read"><div class="prose prose--long">${a.body}</div></div>
  ${postnav ? `<div class="wrap">${postnav}</div>` : ''}
</article>`;

  return layout({
    title: a.title,
    description: a.excerpt,
    body,
    gated,
    plinth: `journal-${a.slug}`,
    canonical: `${CANON}/journal/${a.slug}/`,
  });
}
