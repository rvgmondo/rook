// The product page. Pre-launch, so there is nothing to buy: the page's job is
// to make one flavour feel specific and then hand the visitor to the list.
//
// There is no photography, so the flavour is carried by a black plate that
// holds the name, a wash of the flavour tint, and a frost crown whose strength
// comes straight from the cooling meter. The only bottle drawing on the whole
// site lives at the foot of the right column, captioned as a diagram of the
// real proportions rather than dressed up as a product shot.
//
// The right column never repeats the name, because the name is the h1 and it
// lives on the plate. Everything on the right is something the plate cannot
// say: the family, the notes, the measure, the facts.
//
// The formulations are ROOK IP. The ingredient line below is generic on
// purpose and is the only level of detail this page is allowed to publish.
//
// NOTE FOR THE MERGE: ord/chip/stamp/lrow below are the components.js exports
// described in Part 4 of the spec, kept local only because this pass is not
// allowed to write src/lib/. The markup is structurally identical to Part 4
// and to the copies in home.js and shop.js, so once Agent C lands them the
// swap is a straight substitution:
//   import { meter, signupForm, chip, stamp, ord, lrow } from '../lib/components.js';

import { layout, esc, words, smoke, bottle } from '../render.js';
import { icon } from '../lib/icons.js';
import { meter, signupForm } from '../lib/components.js';
import { products, bySlug, price } from '../data/products.js';
import { productLd, breadcrumbLd } from '../lib/seo.js';

// Two digits, zero padded. One numbering system for the whole site.
const ord = (n) => String(n).padStart(2, '0');

// The identity token. Decorative: the name it sits beside carries the meaning,
// so colour is never the only thing saying which flavour this is.
const chip = (p) => `<span class="chip" style="--f-tint:${esc(p.tint)}" aria-hidden="true"></span>`;

// The maker's stamp. Format is stated in a hairline drawing next to the size,
// which says "60 ml bottle" without pretending to be a photograph of one.
const stamp = () =>
  `<span class="stamp"><svg width="14" height="26" viewBox="0 0 14 26" fill="none" aria-hidden="true" focusable="false"><rect x="5" y="1" width="4" height="3" stroke="currentColor"/><path d="M4 6h6v18a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 4 24z" stroke="currentColor"/></svg>60 ML</span>`;

// The dot leader spec row. The leader is what makes a spec table read as
// engineered rather than administrative, and it is decorative, so it is hidden
// from the reading order and the key and value stay adjacent.
const lrow = (k, v, note = '') => `<div class="lrow">
        <span class="lrow__k">${esc(k)}</span>
        <span class="lrow__d" aria-hidden="true"></span>
        <span class="lrow__v">${esc(v)}${note ? `<span class="lrow__note">${esc(note)}</span>` : ''}</span>
      </div>`;

export function productPage(slug, { gated } = {}) {
  const p = bySlug[slug];
  if (!p) return null;

  const i = products.indexOf(p);
  // Stable per flavour, so the smoke behind Black Ice is always the same
  // picture and the page does not shuffle itself between visits.
  const seed = 12 + i * 9;
  // 0 to 1, straight off the cooling meter. Drives the frost crown on the
  // plate, so Black Ice wears a visible one and Pina Colada, which has no ice
  // in it, wears none. It is the only per-flavour variation other than the
  // wash, and it is true rather than decorative.
  const cold = (p.meters.cooling / 5).toFixed(2);

  const others = products.filter((o) => o.slug !== p.slug);

  // Two smoke panels on this page and no more: one behind the plate, one in
  // the closing band. Each is a displacement filter over a 190 percent region,
  // which is the most expensive thing the site draws.
  const body = `
<div class="wrap pdp__crumbs">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span aria-hidden="true">/</span><a href="/shop/">Shop</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
</div>

<section class="bay pdp__bay"><div class="wrap">
  <div class="pdp">

    <div class="pdp__plate" style="--f-tint:${esc(p.tint)};--f-cold:${cold};view-transition-name:rook-plate-${esc(p.slug)}">
      <span class="plate__wash" aria-hidden="true"></span>
      <canvas class="plate__smoke" data-smoke-tint="${esc(p.tint)}" aria-hidden="true"></canvas>
      <div class="pdp__plate-in">
        <div class="plate__rail"><span class="ord">${ord(i + 1)}</span>${chip(p)}</div>
        <h1 class="pdp__name">${words(p.name)}</h1>
        <p class="plate__soon">Coming soon</p>
        ${stamp()}
      </div>
    </div>

    <div class="pdp__info">
      <p class="tag tag--copper">${esc(p.family)}</p>

      <span class="pdp__hr" aria-hidden="true"></span>
      <ul class="plate__notes">${p.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>

      <p class="pdp__short">${esc(p.short)}</p>

      <h2 class="pdp__h">The measure</h2>
      <div class="pdp__meters">
        ${meter('Intensity', p.meters.intensity)}
        ${meter('Sweetness', p.meters.sweetness)}
        ${meter('Cooling', p.meters.cooling)}
        ${meter('Throat', p.meters.throat)}
      </div>

      <h2 class="pdp__h">The plate</h2>
      <div class="lrows pdp__lrows">
        ${lrow('Price', `R ${price}`, 'Coming soon')}
        ${lrow('Size', '60 ml')}
        ${lrow('Strength', p.strength)}
        ${lrow('Base', '50 / 50, for pods and MTL')}
      </div>

      <figure class="pdp__diagram">
        ${bottle(p.tint, p.name)}
        <figcaption class="micro pdp__cap">Actual proportions. 60 ml.</figcaption>
      </figure>

      <p class="micro pdp__ing">Propylene glycol, vegetable glycerine, nicotine salt and food grade flavouring. Our flavour formulations are our own and are not published.</p>
    </div>

  </div>
</div></section>

<div class="dusk"></div>

<section class="plinth plinth--pdp" id="notify">
  ${smoke({ seed: 44, tint: '#B8985A', opacity: 0.5 })}
  <div class="wrap">
    <h2 class="plinth__t">Be first to get ${esc(p.name)}</h2>
    <p class="plinth__p">It is not on sale yet. Join the list and we will email you the morning it lands, before it goes out anywhere else.</p>
    ${signupForm('product-' + p.slug)}
  </div>
</section>

<div class="dawn dawn--sm"></div>

<section class="bay pdp__also"><div class="wrap">
  <h2 class="pdp__h pdp__h--lg">Also in the range</h2>
  <div class="strip">
    ${others.map((o) => `<a class="strip__it" href="/product/${o.slug}/">${chip(o)}<span class="strip__n">${esc(o.name)}</span><span class="strip__go" aria-hidden="true">${icon('arrow', 16)}</span></a>`).join('')}
  </div>
</div></section>`;

  return layout({
    title: p.name, description: p.short, body, gated,
    // This is the one page that closes on its own black band, so the shared
    // plinth is suppressed. Two plinths would put two blacks back to back.
    //
    // The body still ends on paper, so layout() must emit the dusk before the
    // footer even when the plinth is off, otherwise paper meets the black
    // footer at a hard edge and breaks L3.
    plinth: false,
    canonical: `https://rookvapes.co.za/product/${p.slug}/`,
    jsonld: [
      productLd(p),
      breadcrumbLd([{ name: 'ROOK', url: '/' }, { name: 'Shop', url: '/shop/' }, { name: p.name, url: `/product/${p.slug}/` }]),
    ],
  });
}
