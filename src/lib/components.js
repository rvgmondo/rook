import { esc, bottle } from '../render.js';
import { icon } from './icons.js';
import { price } from '../data/products.js';

// One product card, used on the home range and the shop grid.
export function card(p) {
  return `<article class="card" data-cold="${p.meters.cooling >= 3 ? '1' : '0'}">
    <a class="card__vis" href="/product/${p.slug}/" aria-label="${esc(p.name)}">
      <span class="card__badge card__badge--soon">Coming soon</span>
      ${bottle(p.tint, p.name)}
    </a>
    <div class="card__body">
      <h3 class="card__name"><a href="/product/${p.slug}/">${esc(p.name)}</a></h3>
      <p class="card__notes">${p.notes.map(esc).join(' &middot; ')}</p>
      <p class="card__price">R ${price}</p>
      <p class="card__meta">60 ml / ${esc(p.strength.replace(' nicotine salt', ''))}</p>
      <a class="btn btn--line card__cta" href="/product/${p.slug}/">Get notified ${icon('arrow', 14)}</a>
    </div>
  </article>`;
}

// Waitlist signup form. `source` tags where the signup came from.
export function signupForm(source, cls = '') {
  return `<form class="signup ${cls}" method="post" action="/signup" data-signup>
    <input type="hidden" name="source" value="${esc(source)}">
    <div class="signup__row">
      <label class="sr" for="${esc(source)}-email">Email address</label>
      <input class="input" id="${esc(source)}-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required>
      <button class="btn btn--copper btn--sm" type="submit">Join the list</button>
    </div>
    <p class="notice notice--ondark signup__msg" data-signup-msg hidden></p>
  </form>`;
}

// A single 1-to-5 meter row.
export function meter(label, value) {
  const seg = Array.from({ length: 5 }, (_, i) =>
    `<span class="meter__seg${i < value ? ' is-on' : ''}"></span>`).join('');
  return `<div class="meter"><span class="meter__label">${esc(label)}</span><span class="meter__bar">${seg}</span></div>`;
}
