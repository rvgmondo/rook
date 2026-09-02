import { layout, smoke, bottle, esc } from '../render.js';
import { icon } from '../lib/icons.js';
import { home, prelaunch, site } from '../data/copy.js';
import { products, price } from '../data/products.js';
import { organizationLd, websiteLd, faqLd } from '../lib/seo.js';

// Pre-launch: the hero and second promo say "coming soon"; the rest holds.
const c = { ...home, ...prelaunch };

function card(p) {
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

function signupForm(source, cls = '') {
  return `<form class="signup ${cls}" method="post" action="/signup" data-signup>
    <input type="hidden" name="source" value="${esc(source)}">
    <div class="signup__row">
      <label class="sr" for="${source}-email">Email address</label>
      <input class="input" id="${source}-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required>
      <button class="btn btn--copper btn--sm" type="submit">Join the list</button>
    </div>
    <p class="notice notice--ondark signup__msg" data-signup-msg hidden></p>
  </form>`;
}

export function homePage({ gated, gateError = '', signup = '' } = {}) {
  const seq = products;
  const banner = signup === 'ok'
    ? `<div class="flash"><div class="wrap">You are on the list. Look out for a note when the next batch lands.</div></div>`
    : (signup === 'invalid' ? `<div class="flash flash--error"><div class="wrap">That email did not look right. Try again below.</div></div>` : '');

  const body = `${banner}
<section class="hero hero--shot">
  <div class="hero__shot"><img class="hero__img" src="/img/hero.jpg" alt="" fetchpriority="high" decoding="async"><span class="hero__veil" aria-hidden="true"></span></div>
  <div class="hero__bg">${smoke({ seed: 13, tint: '#C9976A', opacity: 1 })}</div>
  <div class="hero__rail"><a href="${site.instagram}" rel="noopener nofollow" aria-label="Instagram">${icon('instagram', 15)}</a><a href="${site.tiktok}" rel="noopener nofollow" aria-label="TikTok">${icon('tiktok', 15)}</a></div>
  <div class="wrap hero__in">
    <span class="tag tag--copper enter" style="--e:1">${esc(c.eyebrow)}</span>
    <h1 class="hero__title d-hero enter" style="--e:2">${esc(c.headline)}</h1>
    <p class="hero__lede enter" style="--e:3">${esc(c.lede)}</p>
    <p class="hero__cta enter" style="--e:4"><a class="btn btn--copper" href="/shop/">${esc(c.cta)} <span class="arrow">${icon('arrow', 14)}</span></a><a class="btn btn--light" href="/flavours/">${esc(c.cta_alt)}</a></p>
  </div>
</section>

<section class="bay">
  <div class="wrap">
    <div class="shead">
      <h2 class="shead__t">${esc(c.range_tag)}</h2>
      <div class="shead__tabs" data-tabs>
        <button class="shead__tab is-on" type="button" data-filter="all">Everything</button><span class="shead__sep">|</span>
        <button class="shead__tab" type="button" data-filter="cold">Cold</button><span class="shead__sep">|</span>
        <button class="shead__tab" type="button" data-filter="warm">Not cold</button>
      </div>
    </div>
    <div class="cards" data-grid>${seq.map(card).join('')}</div>
  </div>
</section>

<section class="promo">
  <div class="promo__p">
    <div class="promo__bg">${smoke({ seed: 5, tint: '#C9976A', opacity: 1 })}</div>
    <div class="promo__c">
      <span class="tag tag--copper">${esc(c.promo_a_tag)}</span>
      <p class="promo__t" style="margin-top:var(--s3)">${c.promo_a_head}</p>
      <p style="margin-top:var(--s4);color:var(--ink-2);font-size:var(--t-small);max-width:32ch">${esc(c.promo_a_body)}</p>
      <p style="margin-top:var(--s5)"><a class="btn btn--light btn--sm" href="/flavours/">${esc(c.promo_a_cta)}</a></p>
    </div>
  </div>
  <div class="promo__p promo__p--alt" id="signup">
    <div class="promo__bg">${smoke({ seed: 27, tint: '#C9976A', opacity: 1 })}</div>
    <div class="promo__c">
      <span class="tag tag--copper">${esc(c.promo_b_tag)}</span>
      <p class="promo__t" style="margin-top:var(--s3)">${esc(c.promo_b_head)}</p>
      <p style="margin-top:var(--s3);color:var(--ink-2);font-size:var(--t-small);max-width:40ch">${esc(c.promo_b_body)}</p>
      ${signupForm('homepage')}
    </div>
  </div>
</section>

<section class="bay bay--alt">
  <div class="wrap">
    <div class="shead"><h2 class="shead__t">${esc(c.how_tag)}</h2></div>
    <div class="tiles">${c.how_steps.map((s) => `<div class="tile"><p class="tag tag--copper">${esc(s.n)}</p><h3 class="tile__t" style="margin-top:var(--s3)">${esc(s.h)}</h3><span class="tile__r"></span><p class="tile__p">${esc(s.p)}</p></div>`).join('')}</div>
  </div>
</section>

<section class="bay">
  <div class="wrap wrap--read">
    <div class="shead"><h2 class="shead__t">${esc(c.faq_tag)}</h2></div>
    <div class="acc" data-acc>
      ${c.faq.map((f, i) => `<div class="acc__item"><h3><button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-${i}"><span>${esc(f.q)}</span>${icon('down', 16)}</button></h3><div class="acc__panel" id="faq-${i}" hidden><p>${esc(f.a)}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<section class="brands"><div class="wrap"><div class="brands__in" data-marquee>${[0, 1].map((pass) => `<div class="brands__set"${pass ? ' aria-hidden="true"' : ''}>${c.brands.map((b) => `<span class="brands__b">${esc(b)}</span>`).join('')}</div>`).join('')}</div></div></section>

<section class="news">
  <div class="news__bg">${smoke({ seed: 44, tint: '#C9976A', opacity: 0.9 })}</div>
  <div class="wrap news__in">
    <h2 class="news__t">${esc(c.news_head)}</h2>
    <p class="news__p">${esc(c.news_body)}</p>
    ${signupForm('newsletter', 'news__form')}
    <div class="news__social"><a href="${site.instagram}" rel="noopener nofollow" aria-label="Instagram">${icon('instagram', 15)}</a><a href="${site.tiktok}" rel="noopener nofollow" aria-label="TikTok">${icon('tiktok', 15)}</a></div>
  </div>
</section>`;

  return layout({
    title: '', description: prelaunch.lede, body, home: true, gated, gateError,
    canonical: 'https://rookvapes.co.za/',
    jsonld: [organizationLd(), websiteLd(), faqLd(c.faq)],
  });
}
