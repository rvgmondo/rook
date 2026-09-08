import { layout, esc, words } from '../render.js';
import { icon } from '../lib/icons.js';
import { products, price } from '../data/products.js';
import { prelaunch } from '../data/copy.js';

// The range, as an index rather than a grid of pictures.
//
// There is no product photography yet and there will not be any before launch,
// so a card grid can only ever be five drawings of the same bottle in five
// colours. A band states the flavour instead: the name at size, the three
// tasting notes, the facts anyone actually compares on, and a colour wash that
// soaks up from underneath. Format is carried by the maker's stamp, not by a
// bottle shot.
//
// NOTE FOR THE MERGE: plate/chip/stamp/ord below are the components.js exports
// described in Part 4 of the spec, kept local only because this pass is not
// allowed to write src/lib/. Once Agent C lands them, delete the four helpers
// and swap the import for:
//   import { plate, ord } from '../lib/components.js';

// Two digits, zero padded. One numbering system for the whole site.
function ord(n) {
  return String(n).padStart(2, '0');
}

// The format mark. A bottle silhouette drawn in a hairline, next to the size.
// It says "60 ml bottle" without pretending to be a photograph of one.
function stamp() {
  return `<span class="stamp"><svg width="14" height="26" viewBox="0 0 14 26" fill="none" aria-hidden="true" focusable="false"><rect x="5" y="1" width="4" height="3" stroke="currentColor"/><path d="M4 6h6v18a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 4 24z" stroke="currentColor"/></svg>60 ML</span>`;
}

// A fact row inside the band's right hand column.
function fact(k, v) {
  return `<div class="fact"><dt>${esc(k)}</dt><dd>${v}</dd></div>`;
}

// One flavour band. `as` is the heading level, because the same band is an h3
// under a section heading on the homepage and an h2 under the page h1 here.
//
// The whole band is one link: .plate__link carries a stretched pseudo element,
// so there is exactly one tab stop and .plate:focus-within shows the hover
// state across the row. Nothing else inside it is interactive, which is why
// .plate__cta is a span.
function plate(p, i, { as = 'h3' } = {}) {
  const url = `/product/${esc(p.slug)}/`;
  const notes = p.notes.map((n) => `<li>${esc(n)}</li>`).join('');
  const facts = [
    fact('Family', esc(p.family)),
    fact('Strength', esc(p.strength.replace(' nicotine salt', ''))),
    fact('Format', stamp()),
    fact('Price', `R ${price}`),
  ].join('');

  // The view transition name is set server side and is unique per slug. The
  // product page puts the same name on its plate, so the band morphs into the
  // page header on navigation.
  return `<article class="plate rv" data-cold="${p.meters.cooling >= 3 ? '1' : '0'}" style="--f-tint:${esc(p.tint)};view-transition-name:rook-plate-${esc(p.slug)}">
    <span class="plate__wash" aria-hidden="true"></span>
    <div class="plate__rail"><span class="ord">${ord(i + 1)}</span><span class="chip" aria-hidden="true"></span></div>
    <div class="plate__main">
      <${as} class="plate__name"><a class="plate__link" href="${url}">${words(p.name)}</a></${as}>
      <span class="plate__rule" aria-hidden="true"></span>
      <ul class="plate__notes">${notes}</ul>
    </div>
    <div class="plate__side">
      <dl class="plate__facts">${facts}</dl>
      <p class="plate__soon">Coming soon</p>
      <span class="plate__cta">Get notified <span class="arrow">${icon('arrow', 14)}</span></span>
    </div>
  </article>`;
}

export function shopPage({ gated } = {}) {
  const index = products.map((p, i) => plate(p, i, { as: 'h2' })).join('');

  // The page runs on paper from the crumbs to the foot. layout() adds the
  // dusk, the plinth and the footer, so nothing here may end on black.
  const body = `
<header class="phead phead--index">
  <div class="wrap grid12">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span aria-hidden="true">/</span><span aria-current="page">The range</span></nav>
    <h1 class="phead__title">${words('The range')}</h1>
    <span class="phead__rule" aria-hidden="true"></span>
    <p class="phead__lede">${esc(prelaunch.shop_lede)}</p>
  </div>
</header>

<section class="bay sect">
  <div class="wrap">
    <div class="shead">
      <p class="sect__eyebrow"><span class="ord">${ord(1)}</span><span aria-hidden="true">/</span>Choose a flavour</p>
      <div class="shead__tabs" data-tabs role="group" aria-label="Filter the range">
        <button class="shead__tab is-on" type="button" data-filter="all">Everything</button><span class="shead__sep" aria-hidden="true">|</span>
        <button class="shead__tab" type="button" data-filter="cold">Cold</button><span class="shead__sep" aria-hidden="true">|</span>
        <button class="shead__tab" type="button" data-filter="warm">Not cold</button>
      </div>
    </div>
    <div class="index" data-grid>${index}</div>
  </div>
</section>`;

  return layout({
    title: 'Shop',
    description: prelaunch.shop_lede,
    body,
    gated,
    plinth: 'shop',
    canonical: 'https://rookvapes.co.za/shop/',
  });
}
