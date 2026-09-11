import { layout, esc, words } from '../render.js';
import { icon } from '../lib/icons.js';
import { home, prelaunch, site } from '../data/copy.js';
import { products, price, size, launchSlugs } from '../data/products.js';
import { organizationLd, websiteLd, faqLd } from '../lib/seo.js';

// Pre-launch: the hero says "coming soon" and every action is "get notified".
// Nothing on this page can be bought.
const c = { ...home, ...prelaunch };

// NOTE FOR THE MERGE: ord/stamp/plate below are the components.js exports
// described in Part 4 of the spec, kept local only because this pass is not
// allowed to write src/lib/. Once Agent C lands them, delete the helpers and
// swap in:
//   import { plate, ord } from '../lib/components.js';
// The markup is written structurally identical to Part 4 and to the copy in
// shop.js, so the swap is a straight substitution. plate() keeps its `as`
// argument: the same band is an h3 under a section heading here and an h2
// under the page h1 on /shop/.

// Two digits, zero padded. One numbering system for the whole site.
const ord = (n) => String(n).padStart(2, '0');

// The maker's stamp. Format is stated, never photographed.
const stamp = () =>
  `<span class="stamp"><svg width="14" height="26" viewBox="0 0 14 26" fill="none" aria-hidden="true" focusable="false"><rect x="5" y="1" width="4" height="3" stroke="currentColor"/><path d="M4 6h6v18a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 4 24z" stroke="currentColor"/></svg>30 ML</span>`;

// A spec row inside a band. Key left, value right, hairline under.
const fact = (k, v) => `<div class="fact"><dt>${esc(k)}</dt><dd>${v}</dd></div>`;

/*
 * One flavour band.
 *
 * There is no bottle in it. Colour identity comes from the wash and the chip,
 * format from the stamp, and the whole band is one link: .plate__cta is a span
 * so the stretched pseudo-element on .plate__link owns the entire hit area and
 * a keyboard gets exactly one stop per band.
 *
 * The view transition name is set server side and is unique per slug, so the
 * band morphs into the product page plate on navigation.
 */
function plate(p, i, { as = 'h3' } = {}) {
  const notes = p.notes.map((n) => `<li>${esc(n)}</li>`).join('');
  const facts = [
    fact('Family', esc(p.family)),
    fact('Size', esc(size)),
    fact('Format', stamp()),
    fact('Price', `R ${price}`),
  ].join('');

  return `<article class="plate rv" data-cold="${p.meters.cooling >= 3 ? '1' : '0'}" style="--f-tint:${esc(p.tint)};view-transition-name:rook-plate-${esc(p.slug)}">
    <span class="plate__wash" aria-hidden="true"></span>
    <canvas class="plate__smoke" data-smoke-tint="${esc(p.tint)}" aria-hidden="true"></canvas>
    <div class="plate__rail"><span class="ord">${ord(i + 1)}</span><span class="chip" aria-hidden="true"></span></div>
    <div class="plate__main">
      <${as} class="plate__name"><a class="plate__link" href="/product/${esc(p.slug)}/">${words(p.name)}</a></${as}>
      <span class="plate__rule" aria-hidden="true"></span>
      <ul class="plate__notes">${notes}</ul>
    </div>
    <div class="plate__side">
      <dl class="plate__facts">${facts}</dl>
      <p class="plate__soon">${launchSlugs.includes(p.slug) ? 'In the first run' : 'Follows later'}</p>
      <span class="plate__cta">Get notified <span class="arrow">${icon('arrow', 14)}</span></span>
    </div>
  </article>`;
}

/*
 * The guide band. The same object as a flavour band with the flavour parts
 * taken out: no wash, no facts, and a rail carrying two hairlines instead of a
 * number, because it is not part of the range. It carries no view transition
 * name either; those belong to flavours only, and a duplicate name aborts the
 * transition site wide.
 *
 * This is where promo_a lives now that the two panel band is gone.
 *
 * It is rendered as the tail of the index rather than inside [data-grid], so
 * the cold filter cannot take it away. The one visitor who most needs "help me
 * choose" is the one poking at the filters. .index--tail drops its own top
 * hairline so the stack still reads as a single ruled list.
 */
function guideBand() {
  // promo_a_head is written with a hard break for the old two panel band. The
  // masked reveal splits on whitespace, so the break comes out and the line
  // wraps on its own measure.
  const head = c.promo_a_head.replace(/<br\s*\/?>/gi, ' ');
  return `<article class="plate plate--guide rv">
    <div class="plate__rail"><span class="ord ord--rule" aria-hidden="true"></span></div>
    <div class="plate__main">
      <h3 class="plate__name"><a class="plate__link" href="/flavours/">${words(head)}</a></h3>
      <span class="plate__rule" aria-hidden="true"></span>
      <p class="plate__body">${esc(c.promo_a_body)}</p>
    </div>
    <div class="plate__side">
      <span class="plate__cta">${esc(c.promo_a_cta)} <span class="arrow">${icon('arrow', 14)}</span></span>
    </div>
  </article>`;
}

/*
 * Section eyebrow. Every one of these is followed by a heading carrying the
 * same words, so the whole line is hidden from assistive tech rather than read
 * out twice. The ordinal is decorative in exactly the way Part 9 asks for.
 */
const eyebrow = (n, label) =>
  `<p class="sect__eyebrow" aria-hidden="true"><span class="ord">${ord(n)}</span><span>/</span>${esc(label)}</p>`;

// The three tasting-note filters. rook.js binds exactly one [data-tabs] and one
// [data-grid] per page, so this is the only filter set the homepage may carry.
const tabs = () =>
  `<div class="shead__tabs" data-tabs role="group" aria-label="Filter the range">
        <button class="shead__tab is-on" type="button" data-filter="all">Everything</button><span class="shead__sep" aria-hidden="true">|</span>
        <button class="shead__tab" type="button" data-filter="cold">Cold</button><span class="shead__sep" aria-hidden="true">|</span>
        <button class="shead__tab" type="button" data-filter="warm">Not cold</button>
      </div>`;

/*
 * One numbered question.
 *
 * Every panel ships open, with aria-expanded true and no hidden attribute, so
 * the answers are on the page whether or not the script runs. The script only
 * ever closes them. An FAQ that needs JavaScript to be readable is not an FAQ.
 * Markup and the data-acc hook are otherwise as they were.
 */
const faqRow = (f, i) => `<div class="acc__item">
      <h3><button class="acc__btn" type="button" aria-expanded="true" aria-controls="faq-${i}">
        <span class="acc__q"><span class="ord" aria-hidden="true">${ord(i + 1)}</span><span>${esc(f.q)}</span></span>
        ${icon('down', 16)}
      </button></h3>
      <div class="acc__panel" id="faq-${i}"><p>${esc(f.a)}</p></div>
    </div>`;

// One of the three how-we-work columns. Bare numbers and hairlines on black,
// not three boxes. The numeral is big and gold so it cannot be mistaken for the
// small muted ordinal system running down the rest of the page.
const step = (s) => `<div class="cols__i">
        <p class="cols__n">${esc(s.n)}</p>
        <h3 class="cols__h">${esc(s.h)}</h3>
        <p class="cols__p">${esc(s.p)}</p>
      </div>`;

export function homePage({ gated, gateError = '', signup = '' } = {}) {
  const banner = signup === 'ok'
    ? `<div class="flash"><div class="wrap">You are on the list. Look out for a note when the next batch lands.</div></div>`
    : (signup === 'invalid' ? `<div class="flash flash--error"><div class="wrap">That email did not look right. Try again below.</div></div>` : '');

  const body = `${banner}
<section class="hero hero--smoke">
  <canvas class="hero__smoke" data-smoke aria-hidden="true"></canvas>
  <div class="hero__rail"><a href="${site.instagram}" rel="noopener nofollow" aria-label="Instagram">${icon('instagram', 15)}</a><a href="${site.tiktok}" rel="noopener nofollow" aria-label="TikTok">${icon('tiktok', 15)}</a></div>
  <div class="wrap hero__in">
    <span class="hero__eyebrow">${esc(c.eyebrow)}</span>
    <h1 class="hero__title d-hero" aria-label="${esc(c.headline)}">${words(c.headline)}</h1>
    <p class="hero__lede">${esc(c.lede)}</p>
    <p class="hero__cta"><a class="btn btn--copper" href="/shop/">${esc(c.cta)} <span class="arrow">${icon('arrow', 14)}</span></a><a class="btn btn--light" href="/flavours/">${esc(c.cta_alt)}</a></p>
  </div>
  <p class="hero__cue" aria-hidden="true"><span></span>Scroll</p>
</section>
<div class="dawn" aria-hidden="true"></div>

<section class="bay sect" id="range">
  <div class="wrap">
    ${eyebrow(1, c.range_tag)}
    <div class="shead">
      <h2 class="shead__t">${esc(c.range_tag)}</h2>
      ${tabs()}
    </div>
    <p class="sect__statement">${esc(c.range_lede)}</p>
    <div class="index" data-grid>${products.map((p, i) => plate(p, i)).join('')}</div>
    <div class="index index--tail">${guideBand()}</div>
  </div>
</section>

<div class="dusk" aria-hidden="true"></div>

<section class="bay bay--dark sect">
  <div class="wrap">
    ${eyebrow(2, c.how_tag)}
    <h2 class="h2">${esc(c.how_tag)}</h2>
    <div class="cols">${c.how_steps.map(step).join('')}</div>
  </div>
</section>

<div class="dawn dawn--sm" aria-hidden="true"></div>

<section class="bay sect">
  <div class="wrap wrap--read">
    ${eyebrow(3, c.faq_tag)}
    <h2 class="h2">${esc(c.faq_tag)}</h2>
    <div class="acc acc--index" data-acc>
      ${c.faq.map(faqRow).join('')}
    </div>
  </div>
</section>

<section class="brands brands--paper"><div class="wrap"><div class="brands__in" data-marquee>${[0, 1].map((pass) => `<div class="brands__set"${pass ? ' aria-hidden="true"' : ''}>${c.brands.map((b) => `<span class="brands__b">${esc(b)}</span>`).join('')}</div>`).join('')}</div></div></section>`;

  // The page body ends on paper. layout() appends the dusk, the plinth and the
  // footer, so the newsletter and the promo copy that used to sit here now live
  // in the one black foot every page shares. The homepage plinth carries the
  // #signup anchor the launch bar points at.
  return layout({
    title: '', description: prelaunch.lede, body, home: true, gated, gateError,
    plinth: 'homepage', plinthId: 'signup',
    canonical: 'https://rookvapes.co.za/',
    jsonld: [organizationLd(), websiteLd(), faqLd(c.faq)],
  });
}
