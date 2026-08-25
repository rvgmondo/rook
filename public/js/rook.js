// ROOK front-end. Progressive enhancement only: every form works without it.
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var on = function (el, ev, fn, o) { el && el.addEventListener(ev, fn, o || false); };

  // Header: solid/stuck once you leave the top.
  (function () {
    var el = $('[data-header]');
    if (!el) return;
    var tick = function () { el.classList.toggle('is-stuck', (window.scrollY || 0) > 24); };
    on(window, 'scroll', tick, { passive: true }); tick();
  })();

  // Mobile menu.
  (function () {
    var btn = $('[data-menu-toggle]'); var panel = $('[data-menu]');
    if (!btn || !panel) return;
    on(btn, 'click', function () {
      var open = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
    });
    $$('a', panel).forEach(function (a) { on(a, 'click', function () { panel.classList.remove('is-open'); document.body.classList.remove('is-locked'); btn.setAttribute('aria-expanded', 'false'); }); });
  })();

  // Age gate: auto-advance the date fields, focus first.
  (function () {
    var g = $('#gate'); if (!g) return;
    var d = $('#gate-d'), m = $('#gate-m'), y = $('#gate-y');
    if (!d || !m || !y) return;
    setTimeout(function () { d.focus(); }, 120);
    [[d, m, 2], [m, y, 2]].forEach(function (p) {
      on(p[0], 'input', function () { p[0].value = p[0].value.replace(/\D/g, ''); if (p[0].value.length >= p[2]) p[1].focus(); });
    });
    on(y, 'input', function () { y.value = y.value.replace(/\D/g, ''); });
  })();

  // Accordions (FAQ).
  $$('[data-acc]').forEach(function (acc) {
    $$('.acc__btn', acc).forEach(function (btn) {
      on(btn, 'click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = open;
      });
    });
  });

  // Flavour filter tabs.
  (function () {
    var tabs = $('[data-tabs]'); var grid = $('[data-grid]');
    if (!tabs || !grid) return;
    $$('.shead__tab', tabs).forEach(function (tab) {
      on(tab, 'click', function () {
        $$('.shead__tab', tabs).forEach(function (t) { t.classList.remove('is-on'); });
        tab.classList.add('is-on');
        var f = tab.getAttribute('data-filter');
        $$('.card', grid).forEach(function (card) {
          var cold = card.getAttribute('data-cold') === '1';
          var show = f === 'all' || (f === 'cold' && cold) || (f === 'warm' && !cold);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  })();

  // Async waitlist signup: no page reload, inline confirmation.
  $$('[data-signup]').forEach(function (form) {
    var msg = form.querySelector('[data-signup-msg]');
    on(form, 'submit', function (e) {
      if (!msg) return; // no message slot -> let it post normally
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
      fetch('/signup', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'fetch' },
        body: new URLSearchParams(new FormData(form)).toString(),
      }).then(function (r) { return r.json(); }).then(function (res) {
        var ondark = msg.classList.contains('notice--ondark');
        msg.textContent = res.message || 'Something went wrong. Try again.';
        msg.className = 'notice signup__msg' + (ondark ? ' notice--ondark' : '') + (res.ok ? '' : ' notice--error');
        msg.hidden = false;
        if (res.ok) form.reset();
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }).catch(function () { form.submit(); });
    });
  });

  // Scroll reveals + safety net (nothing stays hidden if the observer never fires).
  (function () {
    var items = $$('.rv');
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.add('is-in'); }); }, 2000);
  })();
})();
