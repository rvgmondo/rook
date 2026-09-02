import { layout, esc } from '../render.js';
import { icon } from '../lib/icons.js';
import { articles, articleBySlug } from '../data/journal.js';

export function journalIndex({ gated } = {}) {
  const list = articles.map((a) => `
    <article class="jcard">
      <a class="jcard__link" href="/journal/${a.slug}/">
        <h2 class="jcard__title">${esc(a.title)}</h2>
        <p class="jcard__excerpt">${esc(a.excerpt)}</p>
        <span class="jcard__more">Read ${icon('arrow', 14)}</span>
      </a>
    </article>`).join('');
  const body = `
<header class="phead"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span>/</span><span aria-current="page">Journal</span></nav>
  <h1 class="phead__title h1">Journal</h1>
  <p class="phead__lede lede">Notes on flavour, hardware and how we make the range. No news, no hype.</p>
</div></header>
<section class="bay"><div class="wrap wrap--read"><div class="jlist">${list}</div></div></section>`;
  return layout({ title: 'Journal', description: 'Notes on flavour, hardware and how ROOK makes its range.', body, gated, canonical: 'https://rookvapes.co.za/journal/' });
}

export function journalArticle(slug, { gated } = {}) {
  const a = articleBySlug[slug];
  if (!a) return null;
  const body = `
<header class="phead"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span>/</span><a href="/journal/">Journal</a><span>/</span><span aria-current="page">${esc(a.title)}</span></nav>
  <h1 class="phead__title h1">${esc(a.title)}</h1>
  <p class="phead__lede lede">${esc(a.excerpt)}</p>
</div></header>
<article class="bay"><div class="wrap wrap--read"><div class="prose">${a.body}</div>
  <p class="prose" style="margin-top:var(--s7)"><a class="link" href="/journal/">&larr; All journal</a></p>
</div></article>`;
  return layout({ title: a.title, description: a.excerpt, body, gated, canonical: `https://rookvapes.co.za/journal/${a.slug}/` });
}
