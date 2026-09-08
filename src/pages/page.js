import { layout, esc, words } from '../render.js';
import { icon } from '../lib/icons.js';
import { chip, meter, ord } from '../lib/components.js';
import { pages } from '../data/pages.js';
import { products } from '../data/products.js';

// The interior pages: about, help, wholesale and the legal set, the help me
// choose guide, and contact.
//
// None of them get a black band of their own. The one black on each of these
// pages is the plinth that layout() appends, so every body here ends on paper
// and the foot arrives from one place. That is what keeps two blacks from ever
// touching without any page file having to think about it.

// --- The title page ----------------------------------------------------------

// Air, then a crumb trail, then the name of the page set large and split into
// masked words so it rises the way the hero headline does. Replaces the grey
// .phead band, which was a shop convention rather than a brand one. The rule is
// decorative; the standfirst carries the summary.
//
// The h1 is above the fold, so it is covered by the is-settled safety net that
// rook.js pins on .phead--index three seconds after load.
function pageHead(title, lede) {
  return `<header class="phead phead--index"><div class="wrap grid12">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">ROOK</a><span aria-hidden="true">/</span><span aria-current="page">${esc(title)}</span></nav>
    <h1 class="phead__title" aria-label="${esc(title)}">${words(title)}</h1>
    <span class="phead__rule" aria-hidden="true"></span>
    ${lede ? `<p class="phead__lede">${esc(lede)}</p>` : ''}
  </div></header>`;
}

// --- Blocks ------------------------------------------------------------------

// Bodies in src/data/pages.js are trusted authored HTML, so they go in as
// written. `cls` lets a block sit flush under the one above it: when two bays
// stack, the second one's top padding doubles the gap and opens a hole in the
// rhythm. `tag` is a section by default and an article for the one block that
// is the page's actual content.
const prose = (html, cls = '', tag = 'section') =>
  `<${tag} class="bay${cls ? ' ' + cls : ''}"><div class="wrap wrap--read"><div class="prose">${html}</div></div></${tag}>`;

// Section head: a numbered eyebrow, then the statement. The ordinal belongs to
// one site-wide numbering system, so it is set as .ord and never invented per
// page.
const sectionHead = (n, label, statement) =>
  `<p class="sect__eyebrow"><span class="ord">${ord(n)}</span><span aria-hidden="true">/</span>${esc(label)}</p>
    <h2 class="sect__statement">${esc(statement)}</h2>`;

// --- The decision matrix -----------------------------------------------------

// Column order is fixed across the whole site: intensity, sweetness, cooling,
// throat. Keyed off products[].meters so the table cannot drift from the data.
const METERS = [
  ['Intensity', 'intensity'],
  ['Sweetness', 'sweetness'],
  ['Cooling', 'cooling'],
  ['Throat', 'throat'],
];

// Five flavours as five rows of a real table, scored one to five.
//
// There is no product photography and there will not be any before launch, so
// the honest way to help someone choose is to put the whole range side by side
// and let them read down a column. A table is also the one construction here
// that a screen reader handles better than a picture ever could: a row header
// per flavour, a column header per axis, and a number in every cell.
//
// The flavour name is the only link in the row, matching the one link per band
// rule everywhere else. The wrapper takes a tab stop because it is the single
// horizontal scroller on the site and a keyboard has to be able to reach the
// columns that sit off screen on a phone.
function matrix() {
  const heads = METERS.map(([label]) => `<th scope="col">${label}</th>`).join('');
  const rows = products.map((p) => `<tr>
        <th scope="row">${chip(p)}<a href="/product/${p.slug}/">${esc(p.name)}</a></th>
        ${METERS.map(([label, key]) => `<td>${meter(label, p.meters[key])}</td>`).join('')}
        <td><span class="matrix__cta">Get notified</span></td>
      </tr>`).join('');
  return `<div class="tablewrap" tabindex="0" role="region" aria-label="The ROOK range, scored">
      <table class="matrix">
        <caption class="sr">The ROOK range scored one to five for intensity, sweetness, cooling and throat.</caption>
        <thead><tr><th scope="col">Flavour</th>${heads}<th scope="col"><span class="sr">Action</span></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// --- The help page questions -------------------------------------------------

// /help/ ends in a run of question and answer pairs. The footer links straight
// at this anchor, so the id has to survive whatever we do to the markup.
const FAQ_MARK = '<h2 id="faq">Questions</h2>';

function faqPairs(html) {
  const out = [];
  const re = /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) out.push({ q: m[1], a: m[2] });
  return out;
}

// Panels open, aria-expanded true, no hidden attribute. The script closes them
// on click; without it every answer is still on the page and readable, which is
// the whole point of an FAQ. Nothing is hidden by default, here or anywhere.
//
// The ordinal is generated decoration sitting inside the button, so it is
// hidden from the accessible name: a screen reader should hear the question,
// not "zero three".
function accRow(row, i) {
  return `<div class="acc__item">
      <h3><button class="acc__btn" type="button" aria-expanded="true" aria-controls="help-faq-${i}">
        <span class="acc__q"><span class="ord" aria-hidden="true">${ord(i + 1)}</span><span>${row.q}</span></span>
        ${icon('down', 16)}
      </button></h3>
      <div class="acc__panel" id="help-faq-${i}"><p>${row.a}</p></div>
    </div>`;
}

// Setting the questions as numbered rows reads as an index rather than as more
// prose. If the copy is ever restructured and the pairs stop matching, this
// falls back to the plain prose it was built from, so the page cannot break.
function helpBody(html) {
  const at = html.indexOf(FAQ_MARK);
  if (at < 0) return prose(html, '', 'article');
  const rows = faqPairs(html.slice(at + FAQ_MARK.length));
  if (rows.length < 2) return prose(html, '', 'article');
  return prose(html.slice(0, at), '', 'article')
    + `<section class="bay bay--flush sect"><div class="wrap wrap--read">
        <p class="sect__eyebrow"><span class="ord">${ord(2)}</span><span aria-hidden="true">/</span>Good to know</p>
        <h2 class="sect__statement" id="faq">Questions</h2>
        <div class="acc acc--index" data-acc>${rows.map(accRow).join('')}</div>
      </div></section>`;
}

// --- Pages -------------------------------------------------------------------

// Standard content page: about, help, wholesale, age-policy, terms, privacy.
export function contentPage(key, { gated } = {}) {
  const p = pages[key];
  if (!p) return null;
  const body = pageHead(p.title, p.excerpt)
    + (key === 'help' ? helpBody(p.body) : prose(p.body, '', 'article'))
    + (p.after ? prose(p.after, 'bay--flush') : '');
  return layout({
    title: p.title,
    description: p.excerpt,
    body,
    gated,
    plinth: key,
    canonical: `https://rookvapes.co.za/${key}/`,
  });
}

// Help me choose: how to work out whether salts suit your device, then the whole
// range scored side by side, then how to read the numbers. The table is the
// point of the page, so it gets its own section on the full measure rather than
// being buried inside the reading column.
export function flavoursPage({ gated } = {}) {
  const p = pages.flavours;
  const body = pageHead(p.title, p.excerpt)
    + prose(p.body)
    + `<section class="bay bay--flush sect"><div class="wrap">
        ${sectionHead(2, 'The ROOK range', 'Now pick a direction')}
        ${matrix()}
      </div></section>`
    + prose(p.after, 'bay--flush');
  return layout({
    title: p.title,
    description: p.excerpt,
    body,
    gated,
    plinth: 'flavours',
    canonical: 'https://rookvapes.co.za/flavours/',
  });
}

// Contact: the copy, a real message form on the 12 column grid, then the direct
// addresses. The form keeps its labels, ids, names and honeypot exactly as the
// handler expects; only the layout changes. It posts on its own if the script
// never loads, and rook.js upgrades it to an inline reply if it does.
export function contactPage({ gated, status } = {}) {
  const p = pages.contact;
  const note = status === 'ok'
    ? `<p class="notice cform__note">Thanks. A person reads all of it and will get back to you, usually within one working day.</p>`
    : (status === 'invalid'
      ? `<p class="notice notice--error cform__note">Please add your email and a message so we can reply.</p>`
      : '');

  const form = `<form class="cform grid12" method="post" action="/contact" data-contact>
      ${note}
      <div class="field field--half"><label class="field__label" for="c-name">Name</label><input class="input" id="c-name" name="name" autocomplete="name"></div>
      <div class="field field--half"><label class="field__label" for="c-email">Email</label><input class="input" id="c-email" type="email" name="email" autocomplete="email" required></div>
      <div class="field"><label class="field__label" for="c-subject">Subject</label>
        <select class="select" id="c-subject" name="subject">
          <option>A flavour recommendation</option>
          <option>An order</option>
          <option>Stocking ROOK in my shop</option>
          <option>Something else</option>
        </select></div>
      <div class="field"><label class="field__label" for="c-message">Message</label><textarea class="textarea" id="c-message" name="message" required></textarea></div>
      <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
      <p class="cform__go"><button class="btn btn--copper" type="submit">Send ${icon('arrow', 14)}</button></p>
      <p class="notice notice--error cform__msg" data-contact-msg aria-live="polite" hidden></p>
    </form>`;

  const body = pageHead(p.title, p.excerpt)
    + `<article class="bay"><div class="wrap">
        <div class="prose">${p.body}</div>
        ${form}
      </div></article>`
    + prose(p.after, 'bay--flush');
  return layout({
    title: p.title,
    description: p.excerpt,
    body,
    gated,
    plinth: 'contact',
    canonical: 'https://rookvapes.co.za/contact/',
  });
}
