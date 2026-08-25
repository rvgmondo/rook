import { layout, esc } from '../render.js';
import { card } from '../lib/components.js';
import { products } from '../data/products.js';
import { prelaunch } from '../data/copy.js';

export function shopPage({ gated } = {}) {
  const body = `
<header class="phead"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span>/</span><span aria-current="page">Shop</span></nav>
  <h1 class="phead__title h1">The range</h1>
  <p class="phead__lede lede">${esc(prelaunch.shop_lede)}</p>
</div></header>
<section class="bay"><div class="wrap"><div class="cards" data-grid>${products.map(card).join('')}</div></div></section>`;
  return layout({ title: 'Shop', description: prelaunch.shop_lede, body, gated, canonical: 'https://rookvapes.co.za/shop/' });
}
