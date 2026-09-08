/* ROOK - hero smoke.
 *
 * A single WebGL fragment shader. No Three.js, no framework, no build step:
 * about 6 KB over the wire against ~200 KB for three + R3F, and it draws on
 * the GPU so the main thread stays free for the page.
 *
 * The picture is domain-warped fractal noise - noise used to distort the
 * coordinates of more noise - which is what gives smoke its curl instead of
 * the cloudy blur you get from a plain blur filter.
 *
 * It is defensive on purpose. No WebGL, no context, a failed compile or a
 * lost context all fall back to the CSS gradient painted underneath, so the
 * hero is never blank. Reduced motion draws one still frame. Offscreen and
 * hidden tabs stop the loop entirely.
 */
(function () {
  'use strict';

  var canvas = document.querySelector('[data-smoke]');
  if (!canvas) return;

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var gl = null;
  try {
    var attrs = { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' };
    gl = canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);
  } catch (e) { /* fall through to the gradient */ }

  if (!gl) return;

  /* --- Shaders ----------------------------------------------------------- */

  var VERT = [
    'attribute vec2 p;',
    'void main(){ gl_Position = vec4(p, 0.0, 1.0); }'
  ].join('\n');

  /* mediump keeps older mobile GPUs honest; the scene has no fine detail that
     needs highp, and highp on a phone can halve the frame rate. */
  var FRAG = [
    'precision mediump float;',
    'uniform vec2  u_res;',
    'uniform float u_time;',
    'uniform vec2  u_ptr;',
    'uniform float u_fade;',

    /* Cheap value noise. Smoke is many octaves of low-detail noise, so the
       quality of any single octave matters far less than the count. */
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',

    'float noise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);',
    '}',

    'float fbm(vec2 p){',
    '  float v = 0.0, a = 0.5;',
    '  for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }',
    '  return v;',
    '}',

    'void main(){',
    /* Square-ish space, so the shape does not stretch on wide monitors. */
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;',
    '  float t = u_time * 0.055;',

    /* The pointer nudges the field rather than pushing pixels: it reads as
       air moving, not as a cursor dragging a texture. */
    '  vec2 sp = uv - u_ptr * 0.06;',
    '  sp.y -= t * 0.65;',          /* smoke rises */
    '  sp *= 1.15;',                /* larger plumes read as cinematic; small ones read as static */

    /* Two levels of domain warp. This is the whole trick. */
    '  vec2 q = vec2(fbm(sp + vec2(0.0, 0.0)), fbm(sp + vec2(4.3, 1.7)));',
    '  vec2 r = vec2(fbm(sp + 1.8 * q + vec2(1.7, 9.2) + t * 0.35),',
    '                fbm(sp + 1.8 * q + vec2(8.3, 2.8) - t * 0.28));',
    '  float f = fbm(sp + 1.9 * r);',
    /* Five octaves of noise cluster tightly around 0.5, so used raw the field
       is a flat haze. Stretching that narrow band across the full range is
       what turns it into plumes with cores and edges. */
    '  f = smoothstep(0.35, 0.68, f);',

    /* A band rather than a simple bottom-up ramp. The first term thins the
       smoke as it climbs; the second pulls it up off the floor, so the mass
       sits in the middle of the frame where it is actually seen instead of
       piling up behind the headline. */
    '  float h    = gl_FragCoord.y / u_res.y;',
    '  float rise = smoothstep(1.18, 0.08, h) * smoothstep(-0.10, 0.42, h);',
    '  float vig  = smoothstep(1.30, 0.10, length(uv * vec2(0.72, 1.0)));',

    '  float d = f * rise * vig;',
    '  d = smoothstep(0.05, 0.58, d);',

    '  vec3 base = vec3(0.031, 0.031, 0.039);',   /* near-black ground */
    '  vec3 gold = vec3(0.722, 0.596, 0.353);',   /* ROOK GOLD #B8985A */
    '  vec3 hot  = vec3(0.894, 0.788, 0.541);',   /* lit edge */

    '  vec3 col = mix(base, gold, d * 0.92);',
    '  col = mix(col, hot, smoothstep(0.62, 1.0, d) * 0.55);',

    /* Grain. Dark gold gradients band badly on 8-bit panels; a little noise
       is cheaper and better looking than dithering. */
    '  float g = hash(gl_FragCoord.xy + u_time) - 0.5;',
    '  col += g * 0.018;',

    '  gl_FragColor = vec4(col * u_fade, 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  /* One triangle large enough to cover the clip cube beats two for a quad:
     no shared edge, so no pixels get shaded twice down the diagonal. */
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes  = gl.getUniformLocation(prog, 'u_res');
  var uTime = gl.getUniformLocation(prog, 'u_time');
  var uPtr  = gl.getUniformLocation(prog, 'u_ptr');
  var uFade = gl.getUniformLocation(prog, 'u_fade');

  /* --- Size -------------------------------------------------------------- */

  /* Per-pixel cost here is real, so resolution is where it gets paid for.
     A retina phone at full DPR is four times the work for detail nobody can
     see in a soft gradient. Cap hard and let the smoothness carry it. */
  var scale = 1;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (window.innerWidth < 760) dpr = Math.min(dpr, 1.1);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr * scale));
    var h = Math.max(1, Math.round(canvas.clientHeight * dpr * scale));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }

  /* --- Pointer ----------------------------------------------------------- */

  var px = 0, py = 0, tx = 0, ty = 0;
  if (!reduced && matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* --- Loop -------------------------------------------------------------- */

  var raf = 0, t0 = performance.now(), visible = true, onscreen = true;

  function frame(now) {
    raf = 0;
    /* Chase the pointer instead of snapping to it. */
    px += (tx - px) * 0.045;
    py += (ty - py) * 0.045;
    gl.uniform2f(uPtr, px, py);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform1f(uFade, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (visible && onscreen) raf = requestAnimationFrame(frame);
  }

  function play() { if (!raf && visible && onscreen && !reduced) raf = requestAnimationFrame(frame); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  function still() {
    /* One frame, at a time offset that gives a composed shape rather than
       the flat field you get at t=0. */
    gl.uniform2f(uPtr, 0, 0);
    gl.uniform1f(uTime, 12);
    gl.uniform1f(uFade, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  resize();
  canvas.classList.add('is-live');

  if (reduced) {
    still();
  } else {
    play();
  }

  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); if (reduced) still(); }, 150);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden;
    if (visible) play(); else stop();
  });

  /* Scrolled past the hero, there is nothing to look at. Stop burning GPU. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onscreen = entries[0].isIntersecting;
      if (onscreen) play(); else stop();
    }, { threshold: 0 }).observe(canvas);
  }

  /* A lost context (GPU reset, tab backgrounded for a long time on mobile)
     would otherwise leave a black rectangle sitting over the gradient. */
  canvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
    stop();
    canvas.classList.remove('is-live');
  });
})();
