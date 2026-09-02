// Server-rendered HTML. Plain template literals, no engine or build step, so it
// installs and runs anywhere Node does. Every page goes through layout().

import { mark, icon } from './lib/icons.js';
import { site } from './data/copy.js';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// --- Procedural smoke, used behind dark sections -----------------------------
let smokeSeq = 0;
export function smoke({ seed = 7, tint = '#C9976A', opacity = 1, cls = '' } = {}) {
  const id = 'smk' + ++smokeSeq;
  return `<div class="smoke ${cls}" aria-hidden="true">
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <filter id="${id}-f" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0034 0.0068" numOctaves="4" seed="${seed}" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="380" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="9"/>
        </filter>
        <radialGradient id="${id}-g" cx="50%" cy="54%" r="52%">
          <stop offset="0%" stop-color="${tint}" stop-opacity=".85"/>
          <stop offset="55%" stop-color="${tint}" stop-opacity=".26"/>
          <stop offset="100%" stop-color="${tint}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <g class="smoke__l smoke__l1" opacity="${opacity}"><ellipse cx="740" cy="480" rx="430" ry="300" fill="url(#${id}-g)" filter="url(#${id}-f)"/></g>
      <g class="smoke__l smoke__l2" opacity="${opacity * 0.6}"><ellipse cx="470" cy="360" rx="290" ry="360" fill="url(#${id}-g)" filter="url(#${id}-f)"/></g>
      <g class="smoke__l smoke__l3" opacity="${opacity * 0.42}"><ellipse cx="1010" cy="560" rx="340" ry="250" fill="url(#${id}-g)" filter="url(#${id}-f)"/></g>
    </svg>
  </div>`;
}

// --- A single 60 ml bottle, tinted to the flavour ----------------------------
export function bottle(tint = '#B8985A', name = '') {
  return `<svg class="bottle" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(name)} bottle">
    <rect x="49" y="6" width="22" height="20" rx="3" fill="#141414"/>
    <rect x="46" y="24" width="28" height="10" rx="2" fill="#1c1c1c"/>
    <path d="M44 40c0-3 2-6 6-6h20c4 0 6 3 6 6v6c10 4 16 12 16 24v104c0 8-6 14-14 14H42c-8 0-14-6-14-14V70c0-12 6-20 16-24z" fill="#ffffff" stroke="#e4dfd5" stroke-width="1"/>
    <path d="M32 96h56v88c0 6-4 10-10 10H42c-6 0-10-4-10-10z" fill="${tint}" opacity="0.9"/>
    <rect x="34" y="110" width="52" height="60" rx="2" fill="#ffffff" opacity="0.94"/>
    <text x="60" y="132" text-anchor="middle" font-family="Raleway, sans-serif" font-size="7" letter-spacing="1.5" fill="#0A0A0A">ROOK</text>
    <text x="60" y="146" text-anchor="middle" font-family="Raleway, sans-serif" font-size="8" font-weight="700" letter-spacing="0.5" fill="#0A0A0A">${esc(name).toUpperCase()}</text>
    <text x="60" y="160" text-anchor="middle" font-family="Raleway, sans-serif" font-size="5.5" letter-spacing="1" fill="#6E6960">60 ML</text>
    <rect x="36" y="44" width="6" height="120" rx="3" fill="#ffffff" opacity="0.5"/>
  </svg>`;
}

// --- Header ------------------------------------------------------------------
function header({ home = false } = {}) {
  const navItems = site.nav.map((n) => `<a href="${n.url}">${esc(n.text)}</a>`).join('');
  return `<div class="lbar"><div class="wrap"><p class="lbar__t">Launching soon. Join the list and get first pick of the first batch. <a class="lbar__a" href="/#signup">Join the list</a></p></div></div>
  <header class="hdr${home ? ' hdr--over' : ''}" data-header>
    <div class="hdr__in">
      <a class="logo" href="/" rel="home" aria-label="ROOK, home">${mark('logo__mark')}<span class="logo__word">ROOK</span></a>
      <nav class="nav" aria-label="Primary">${navItems}</nav>
      <div class="hdr__end">
        <button class="burger" type="button" data-menu-toggle aria-expanded="false" aria-label="Menu"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <nav class="menu" data-menu aria-label="Mobile">
    <div class="menu__in">${site.nav.map((n) => `<a href="${n.url}">${esc(n.text)}</a>`).join('')}</div>
  </nav>`;
}

// --- Footer ------------------------------------------------------------------
function footer() {
  return `<footer class="ftr">
    <div class="wrap ftr__grid">
      <div class="ftr__brand">
        <a class="logo ftr__logo" href="/" aria-label="ROOK, home">${mark('logo__mark')}<span class="logo__word">ROOK</span></a>
        <p class="ftr__addr">Gauteng, South Africa<br>Email: <a href="mailto:${site.email}">${site.email}</a><br>Trade: <a href="mailto:${site.sales}">${site.sales}</a></p>
      </div>
      <div class="ftr__col"><h2 class="ftr__h">Shop</h2><ul><li><a href="/shop/">Everything we sell</a></li><li><a href="/flavours/">Help me pick</a></li></ul></div>
      <div class="ftr__col"><h2 class="ftr__h">About</h2><ul><li><a href="/about/">About ROOK</a></li><li><a href="/journal/">Journal</a></li><li><a href="/contact/">Contact</a></li><li><a href="/wholesale/">Stock ROOK</a></li></ul></div>
      <div class="ftr__col"><h2 class="ftr__h">Help</h2><ul><li><a href="/help/">Delivery and returns</a></li><li><a href="/help/#faq">Questions</a></li><li><a href="/age-policy/">Age policy</a></li><li><a href="/terms/">Terms</a></li><li><a href="/privacy/">Privacy</a></li></ul></div>
      <div class="ftr__col ftr__social"><h2 class="ftr__h">Follow</h2><div class="ftr__icons"><a href="${site.instagram}" rel="noopener nofollow" aria-label="Instagram">${icon('instagram', 16)}</a><a href="${site.tiktok}" rel="noopener nofollow" aria-label="TikTok">${icon('tiktok', 16)}</a></div></div>
    </div>
    <div class="wrap ftr__base">
      <p class="ftr__warn">Contains nicotine. Nicotine is an addictive substance. Not for anyone under 18, non-smokers, or anyone pregnant or breastfeeding.</p>
      <div class="ftr__legal"><p>&copy; ${new Date().getFullYear()} ROOK. Gauteng, South Africa.</p><p>Adults 18+ only. We verify age at checkout.</p></div>
    </div>
  </footer>`;
}

// --- Age gate ----------------------------------------------------------------
export function ageGate(error = '') {
  const msg = error === 'under'
    ? 'You must be 18 or older to enter.'
    : (error === 'invalid' ? 'That date does not look right. Try again.'
      : (error === 'incomplete' ? 'Enter your full date of birth.' : ''));
  const field = (label, name, id, len, ph) =>
    `<label class="field"><span class="field__label">${label}</span><input class="input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="${len}" name="${name}" id="${id}" placeholder="${ph}" autocomplete="off"></label>`;
  return `<div class="gate" id="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <div class="gate__in">
      <span class="logo gate__logo">${mark('logo__mark')}<span class="logo__type"><span class="logo__word">ROOK</span> <span class="logo__tag">made in South Africa</span></span></span>
      <h1 class="gate__title h1" id="gate-title">This site is for adults.</h1>
      <p class="gate__copy">ROOK sells nicotine products. Enter your date of birth to continue. We keep the answer, not the date.</p>
      <form class="gate__form" method="post" action="/gate">
        <div class="gate__dob">
          ${field('Day', 'd', 'gate-d', 2, '00')}
          ${field('Month', 'm', 'gate-m', 2, '00')}
          ${field('Year', 'y', 'gate-y', 4, '1996')}
        </div>
        <p class="notice notice--error" id="gate-error"${msg ? '' : ' hidden'}>${esc(msg)}</p>
        <button class="btn btn--block" type="submit">Enter</button>
      </form>
      <p class="gate__legal">By entering you confirm you are 18 or older and a current nicotine user. Nicotine is an addictive substance. Not for use by non-smokers, people under 18, or anyone who is pregnant or breastfeeding. <a href="/age-policy/">Age policy</a> and <a href="/privacy/">privacy</a>.</p>
    </div>
  </div>`;
}

// --- Full page shell ---------------------------------------------------------
export function layout({ title, description, body, home = false, gated = false, gateError = '', canonical = '', jsonld = [] } = {}) {
  const fullTitle = title ? `${title} - ROOK` : 'ROOK';
  const desc = description || site.tagline;
  return `<!doctype html>
<html lang="en-ZA" class="${gated ? 'is-gated' : ''}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ROOK">
<meta property="og:image" content="https://rookvapes.co.za/img/hero.jpg">
<meta name="twitter:card" content="summary_large_image">
${jsonld.join('\n')}
<link rel="icon" href="/img/logo-fav.png">
<link rel="apple-touch-icon" href="/img/logo-fav.png">
<meta name="theme-color" content="#0A0A0A">
<link rel="preload" href="/fonts/raleway.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:"Raleway";font-style:normal;font-weight:300 800;font-display:swap;src:url(/fonts/raleway.woff2) format("woff2-variations")}
@font-face{font-family:"Saira";font-style:normal;font-weight:300 800;font-display:swap;src:url(/fonts/saira.woff2) format("woff2-variations")}
@font-face{font-family:"Barlow";font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/barlow-400.woff2) format("woff2")}
html{background:#F5F3EE}
</style>
<link rel="stylesheet" href="/css/rook.css">
<link rel="stylesheet" href="/css/shop.css">
<link rel="stylesheet" href="/css/app.css">
<script>document.documentElement.className+=" rk-js";</script>
</head>
<body class="${gated ? 'is-gated is-locked' : ''}">
<a class="skip" href="#main">Skip to content</a>
<div class="site">
${header({ home })}
<main id="main">${body}</main>
${footer()}
</div>
${gated ? ageGate(gateError) : ''}
<script src="/js/rook.js" defer></script>
</body>
</html>`;
}

// A styled 500.
export function errorPage() {
  const body = `<header class="phead"><div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span>/</span><span aria-current="page">Error</span></nav>
    <h1 class="phead__title h1">Something went wrong</h1>
    <p class="phead__lede lede">That is on us, not you. Try again in a moment.</p>
  </div></header>
  <section class="bay"><div class="wrap wrap--read"><div class="prose">
    <p>Head back to <a href="/">the homepage</a>, or if it keeps happening, tell us at <a href="mailto:hello@rookvapes.co.za">hello@rookvapes.co.za</a>.</p>
  </div></div></section>`;
  return layout({ title: 'Something went wrong', description: 'An error occurred.', body });
}

// A styled 404.
export function notFoundPage({ gated = false } = {}) {
  const body = `<header class="phead"><div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span>/</span><span aria-current="page">Not found</span></nav>
    <h1 class="phead__title h1">Page not found</h1>
    <p class="phead__lede lede">That page is not here. It may have moved, or never existed.</p>
  </div></header>
  <section class="bay"><div class="wrap wrap--read"><div class="prose">
    <p>Try the <a href="/shop/">range</a>, the <a href="/flavours/">help me choose</a> page, or <a href="/">the homepage</a>. If something on the site sent you here, tell us at <a href="mailto:hello@rookvapes.co.za">hello@rookvapes.co.za</a>.</p>
  </div></div></section>`;
  return layout({ title: 'Page not found', description: 'Page not found.', body, gated });
}

export { esc };
