import { esc } from '../render.js';

// Waitlist signup form. `source` tags where the signup came from.
export function signupForm(source, cls = '') {
  return `<form class="signup ${cls}" method="post" action="/signup" data-signup>
    <input type="hidden" name="source" value="${esc(source)}">
    <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
    <div class="signup__row">
      <label class="sr" for="${esc(source)}-email">Email address</label>
      <input class="input" id="${esc(source)}-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required>
      <button class="btn btn--copper btn--sm" type="submit">Join the list</button>
    </div>
    <p class="notice notice--ondark signup__msg" data-signup-msg aria-live="polite" hidden></p>
  </form>`;
}

/*
 * A single 1-to-5 scale row.
 *
 * The bars carry no text, so on their own a screen reader got the label and
 * then silence. The value is now written out, which fixes that and also reads
 * better sighted: a spec sheet states its numbers rather than making you count
 * segments. The bars themselves are decorative once the number is there.
 */
export function meter(label, value) {
  const seg = Array.from({ length: 5 }, (_, i) =>
    `<span class="meter__seg${i < value ? ' is-on' : ''}"></span>`).join('');
  return `<div class="meter"><span class="meter__label">${esc(label)}</span><span class="meter__bar" aria-hidden="true">${seg}</span><span class="meter__v">${esc(value)}<span class="meter__d">/5</span></span></div>`;
}

/*
 * Two digit ordinal, zero padded. One numbering system for the whole site:
 * the range index, section eyebrows, FAQ rows and journal entries all count
 * with these, which is what makes the numbering read as a system rather than
 * as decoration on individual pages.
 */
export function ord(n) {
  return String(n).padStart(2, '0');
}

/*
 * The flavour chip. A small colour dot, and the ONLY place a flavour's own
 * colour is allowed to appear at this size.
 *
 * The tint rides in as a custom property rather than as a background, so the
 * stylesheet decides how it is drawn and can cap opacity or swap the shape
 * without every call site changing. Controls stay gold everywhere: a chip
 * identifies, it never acts.
 */
export function chip(p) {
  return `<span class="chip" aria-hidden="true" style="--f-tint:${esc(p.tint)}"></span>`;
}
