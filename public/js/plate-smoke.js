/* ROOK - flavour smoke.
 *
 * Every flavour plate carries its own living tinted smoke field. This is the
 * brand's one genuinely expensive-looking asset, and until now it appeared
 * once in the hero and nowhere else, while the flavour listing fell back to
 * pastel CSS gradients that looked like a slide deck.
 *
 * The obvious implementation - one WebGL context per plate - does not work.
 * Browsers cap live contexts somewhere around sixteen and start silently
 * dropping the oldest, so a five plate page plus the hero is already flirting
 * with it and a longer index would break outright.
 *
 * So there is ONE offscreen GL context. Each frame it renders the shader once
 * per visible plate, with that plate's tint, and blits the result into the
 * plate's own 2D canvas with drawImage. Off screen plates are not rendered at
 * all, so the usual cost is one or two renders a frame at 480x300 regardless
 * of how many flavours exist.
 *
 * Degrades the same way the hero does: no WebGL, no context, a failed compile
 * or a lost context all leave the CSS gradient underneath on show.
 */
(function () {
  'use strict';

  var targets = [].slice.call(document.querySelectorAll('[data-smoke-tint]'));
  if (!targets.length) return;

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- The one shared context -------------------------------------------- */

  var GW = 480, GH = 300;              /* render size; blitting scales it up */
  var gl = null, glCanvas = null;

  try {
    glCanvas = document.createElement('canvas');
    glCanvas.width = GW; glCanvas.height = GH;
    var attrs = { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' };
    gl = glCanvas.getContext('webgl', attrs) || glCanvas.getContext('experimental-webgl', attrs);
  } catch (e) { /* fall through to the gradient */ }

  if (!gl) return;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';

  var FRAG = [
    'precision mediump float;',
    'uniform vec2  u_res;',
    'uniform float u_time;',
    'uniform vec3  u_tint;',
    'uniform float u_gain;',
    'uniform vec2  u_ptr;',
    'uniform float u_par;',

    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
    'float noise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x), mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);',
    '}',
    'float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }',

    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;',
    '  float t = u_time * 0.05;',
    /* The pointer displaces the field rather than moving pixels, so it reads
       as air being disturbed over the plate, not as a texture being dragged. */
    '  vec2 sp = uv - u_ptr * 0.09;',
    '  sp.y -= t * 0.6;',
    '  sp.y += u_par * 0.42;',
    '  sp *= 1.25;',

    /* Same two level domain warp as the hero, so the plates and the opener
       are visibly the same material rather than two different effects. */
    '  vec2 q = vec2(fbm(sp), fbm(sp + vec2(4.3, 1.7)));',
    '  vec2 r = vec2(fbm(sp + 1.8 * q + vec2(1.7, 9.2) + t * 0.34), fbm(sp + 1.8 * q + vec2(8.3, 2.8) - t * 0.27));',
    '  float f = fbm(sp + 1.9 * r);',
    '  f = smoothstep(0.34, 0.70, f);',

    /* Drifts in from the left, because the flavour name sits on that side and
       the smoke should gather behind it rather than fight the spec column. */
    '  float x    = gl_FragCoord.x / u_res.x;',
    '  float lean = 0.62 + 0.38 * smoothstep(1.25, -0.15, x);',
    '  float band = 0.55 + 0.45 * smoothstep(-0.35, 0.55, gl_FragCoord.y / u_res.y);',

    '  float d = f * lean * band * u_gain;',
    '  d = smoothstep(0.13, 0.52, d);',

    /* Premultiplied against black: the plate ground is near black, so the
       smoke is the tint lifting out of it rather than a colour laid on top. */
    /* Real smoke catches light: thin edges stay the raw tint, dense cores
       lift toward white. Multiplying a dark tint down, as this did, made a
       navy flavour read as an almost black rectangle. */
    '  vec3 lit = mix(u_tint, vec3(1.0), 0.44);',
    '  vec3 col = mix(u_tint * 0.55, lit, smoothstep(0.15, 0.95, d));',
    '  float g = hash(gl_FragCoord.xy + u_time) - 0.5;',
    '  col += g * 0.02;',
    '  gl_FragColor = vec4(col * d, d);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes  = gl.getUniformLocation(prog, 'u_res');
  var uTime = gl.getUniformLocation(prog, 'u_time');
  var uTint = gl.getUniformLocation(prog, 'u_tint');
  var uGain = gl.getUniformLocation(prog, 'u_gain');
  var uPtr  = gl.getUniformLocation(prog, 'u_ptr');
  var uPar  = gl.getUniformLocation(prog, 'u_par');

  gl.viewport(0, 0, GW, GH);
  gl.uniform2f(uRes, GW, GH);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  /* --- Targets ------------------------------------------------------------ */

  function hexToRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n)) return [0.72, 0.60, 0.35];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  /* The five tints are nowhere near equal in luminance: a navy and a hot
     pink at the same density give one plate a whisper and the next a flood.
     Each flavour gets a gain normalised against its own brightest channel, so
     all five read with the same weight and the range looks like one set. */
  function normalise(rgb) {
    var mx = Math.max(rgb[0], rgb[1], rgb[2]);
    return 0.62 / (0.10 + mx);
  }

  var items = targets.map(function (c) {
    var tint = hexToRgb(c.getAttribute('data-smoke-tint'));
    return {
      canvas: c,
      ctx: c.getContext('2d'),
      tint: tint,
      base: normalise(tint),
      gain: 1,
      px: 0, py: 0, tx: 0, ty: 0,
      visible: false,
      sized: false,
    };
  }).filter(function (it) { return !!it.ctx; });

  if (!items.length) return;

  function size(it) {
    /* Backing store is capped hard: this is a soft gradient blown up from a
       480x300 render, so extra pixels buy nothing but memory. */
    var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    var w = Math.max(1, Math.round(it.canvas.clientWidth * dpr));
    var h = Math.max(1, Math.round(it.canvas.clientHeight * dpr));
    if (it.canvas.width === w && it.canvas.height === h) return;
    it.canvas.width = w; it.canvas.height = h;
    it.sized = true;
  }

  function paint(it, now) {
    size(it);
    if (!it.canvas.width || !it.canvas.height) return;
    gl.uniform1f(uTime, now / 1000);
    gl.uniform3f(uTint, it.tint[0], it.tint[1], it.tint[2]);
    gl.uniform1f(uGain, it.gain * it.base);
    it.px += (it.tx - it.px) * 0.06;
    it.py += (it.ty - it.py) * 0.06;
    gl.uniform2f(uPtr, it.px, it.py);
    var b = it.canvas.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var prog01 = (b.top + b.height / 2 - vh / 2) / (vh / 2 + b.height / 2);
    gl.uniform1f(uPar, Math.max(-1.6, Math.min(1.6, prog01)));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    it.ctx.clearRect(0, 0, it.canvas.width, it.canvas.height);
    it.ctx.drawImage(glCanvas, 0, 0, it.canvas.width, it.canvas.height);
    it.canvas.classList.add('is-live');
  }

  /* --- Loop --------------------------------------------------------------- */

  var raf = 0, docVisible = true;

  function frame(now) {
    raf = 0;
    var any = false;
    for (var i = 0; i < items.length; i++) {
      if (!items[i].visible) continue;
      any = true;
      paint(items[i], now);
    }
    if (any && docVisible && !reduced) raf = requestAnimationFrame(frame);
  }
  function play() { if (!raf && docVisible && !reduced) raf = requestAnimationFrame(frame); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var it = items.filter(function (x) { return x.canvas === e.target; })[0];
        if (!it) return;
        it.visible = e.isIntersecting;
        /* Reduced motion still gets one composed still frame, so the plate is
           never an empty black rectangle. */
        if (e.isIntersecting && reduced) paint(it, 12000);
      });
      play();
    }, { rootMargin: '150px 0px' });
    items.forEach(function (it) { io.observe(it.canvas); });
  } else {
    items.forEach(function (it) { it.visible = true; });
    if (reduced) items.forEach(function (it) { paint(it, 12000); });
    else play();
  }

  document.addEventListener('visibilitychange', function () {
    docVisible = !document.hidden;
    if (docVisible) play(); else stop();
  });

  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      items.forEach(function (it) { it.canvas.width = 0; });
      if (reduced) items.forEach(function (it) { if (it.visible) paint(it, 12000); });
      else play();
    }, 160);
  }, { passive: true });

  /* Hover lifts the smoke on that plate rather than switching a colour. */
  items.forEach(function (it) {
    var host = it.canvas.closest ? it.canvas.closest('.plate') : null;
    if (!host || reduced) return;
    host.addEventListener('pointermove', function (e) {
      var b = host.getBoundingClientRect();
      it.tx = ((e.clientX - b.left) / b.width) * 2 - 1;
      it.ty = ((e.clientY - b.top) / b.height) * 2 - 1;
      play();
    }, { passive: true });
    host.addEventListener('pointerenter', function () { it.gain = 1.5; play(); });
    host.addEventListener('pointerleave', function () { it.gain = 1; it.tx = 0; it.ty = 0; play(); });
    host.addEventListener('focusin', function () { it.gain = 1.5; play(); });
    host.addEventListener('focusout', function () { it.gain = 1; play(); });
  });

  glCanvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault(); stop();
    items.forEach(function (it) { it.canvas.classList.remove('is-live'); });
  });
})();
