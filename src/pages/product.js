import { layout, esc, bottle } from '../render.js';
import { icon } from '../lib/icons.js';
import { meter, signupForm } from '../lib/components.js';
import { bySlug, price } from '../data/products.js';
import { productLd, breadcrumbLd } from '../lib/seo.js';

export function productPage(slug, { gated } = {}) {
  const p = bySlug[slug];
  if (!p) return null;

  const body = `
<header class="phead"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span>/</span><a href="/shop/">Shop</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
</div></header>
<section class="bay"><div class="wrap">
  <div class="pdp">
    <div class="pdp__vis"><span class="card__badge card__badge--soon">Coming soon</span>${bottle(p.tint, p.name)}</div>
    <div class="pdp__info">
      <p class="tag tag--copper">${esc(p.family)}</p>
      <h1 class="pdp__name d-xl">${esc(p.name)}</h1>
      <p class="pdp__notes">${p.notes.map(esc).join(' &middot; ')}</p>
      <p class="pdp__short">${esc(p.short)}</p>
      <div class="pdp__meters">
        ${meter('Intensity', p.meters.intensity)}
        ${meter('Sweetness', p.meters.sweetness)}
        ${meter('Cooling', p.meters.cooling)}
        ${meter('Throat', p.meters.throat)}
      </div>
      <div class="pdp__spec">
        <div class="spec"><span class="spec__k">Price</span><span class="spec__v">R ${price}</span></div>
        <div class="spec"><span class="spec__k">Size</span><span class="spec__v">60 ml</span></div>
        <div class="spec"><span class="spec__k">Strength</span><span class="spec__v">${esc(p.strength)}</span></div>
        <div class="spec"><span class="spec__k">Base</span><span class="spec__v">50 / 50, for pods and MTL</span></div>
      </div>
      <div class="pdp__notify">
        <p class="pdp__soon">Not on sale yet. Join the list and we will email you the moment ${esc(p.name)} is in stock.</p>
        ${signupForm('product-' + p.slug, 'signup--light')}
      </div>
      <p class="micro pdp__ing">Propylene glycol, vegetable glycerine, nicotine salt and food grade flavouring. Our flavour formulations are our own and are not published.</p>
    </div>
  </div>
</div></section>`;

  return layout({
    title: p.name, description: p.short, body, gated,
    canonical: `https://rookvapes.co.za/product/${p.slug}/`,
    jsonld: [
      productLd(p),
      breadcrumbLd([{ name: 'ROOK', url: '/' }, { name: 'Shop', url: '/shop/' }, { name: p.name, url: `/product/${p.slug}/` }]),
    ],
  });
}
