/* Turma viva RBio — personagens interativos.
   - Computador: a Pseudomonas aparece de tempos em tempos e nada atrás do ponteiro.
   - Celular: ela atravessa a tela nadando, uma vez por visita.
   - Personagens com [data-fato] pulam e mostram uma curiosidade ao toque/clique.
   Respeita "reduzir movimento" e nunca bloqueia cliques. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var css = document.createElement('style');
  css.textContent =
    '.tv-swimmer{position:fixed;left:0;top:0;width:96px;z-index:80;pointer-events:none;will-change:transform;opacity:0;transition:opacity .5s}' +
    '.tv-swimmer.on{opacity:1}' +
    '.tv-swimmer img{width:100%;display:block;filter:drop-shadow(0 8px 10px rgba(8,40,63,.18));animation:tv-wig .35s ease-in-out infinite alternate}' +
    '@keyframes tv-wig{from{transform:scaleY(1) skewX(-3deg)}to{transform:scaleY(.94) skewX(3deg)}}' +
    '.tv-bubble{position:fixed;z-index:81;pointer-events:none;background:#08283f;color:#e8f7f8;font:700 12px/1.3 Inter,system-ui,sans-serif;padding:7px 10px;border-radius:10px;opacity:0;transform:translateY(6px);transition:.25s;max-width:220px}' +
    '.tv-bubble.on{opacity:1;transform:none}' +
    '[data-fato]{cursor:pointer}' +
    '[data-fato].tv-jump{animation:tv-jump .6s cubic-bezier(.3,1.6,.5,1)!important}' +
    '@keyframes tv-jump{0%{transform:translateY(0) scale(1)}35%{transform:translateY(-26px) scale(1.06,.94)}70%{transform:translateY(0) scale(.96,1.04)}100%{transform:translateY(0) scale(1)}}';
  document.head.appendChild(css);

  var bubble = document.createElement('div');
  bubble.className = 'tv-bubble';
  bubble.setAttribute('role', 'status');
  bubble.setAttribute('aria-live', 'polite');
  document.body.appendChild(bubble);
  var bubbleTimer;
  function say(text, x, y) {
    bubble.textContent = text;
    var w = Math.min(220, window.innerWidth - 20);
    bubble.style.left = Math.max(10, Math.min(x - w / 2, window.innerWidth - w - 10)) + 'px';
    bubble.style.top = Math.max(10, y - 54) + 'px';
    bubble.classList.add('on');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.classList.remove('on'); }, 2600);
  }

  // Personagens clicáveis com curiosidade
  document.querySelectorAll('[data-fato]').forEach(function (el) {
    el.style.pointerEvents = 'auto';
    el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', (el.getAttribute('data-nome') || 'Personagem') + ': ver curiosidade');
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    el.addEventListener('click', function () {
      if (!reduce) {
        el.classList.remove('tv-jump'); void el.offsetWidth; el.classList.add('tv-jump');
        el.addEventListener('animationend', function f() { el.classList.remove('tv-jump'); el.removeEventListener('animationend', f); });
      }
      var r = el.getBoundingClientRect();
      say(el.getAttribute('data-fato'), r.left + r.width / 2, r.top);
      if (typeof gtag === 'function') gtag('event', 'turma_clique', { personagem: el.getAttribute('data-nome') || '' });
    });
  });

  if (reduce) return;

  var src = (document.querySelector('[data-swimmer]') || {}).getAttribute ?
    document.querySelector('[data-swimmer]').getAttribute('data-swimmer') : 'img/turma/pseudomonas.svg';
  var sw = document.createElement('div');
  sw.className = 'tv-swimmer';
  sw.setAttribute('aria-hidden', 'true');
  sw.innerHTML = '<img src="' + src + '" alt="">';
  document.body.appendChild(sw);

  var x = -120, y = 200, ang = 0, flip = 1, raf = null;
  function place() {
    sw.style.transform = 'translate(' + (x - 48) + 'px,' + (y - 34) + 'px) rotate(' + ang + 'deg) scaleX(' + flip + ')';
  }

  if (fine) {
    // Computador: persegue o ponteiro por ~9 s, a cada ~35 s, até 4 vezes por visita
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, moved = false;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; moved = true; }, { passive: true });
    var runs = 0, chasing = false, until = 0, phrases = ['Te peguei! 🦠', 'Sou móvel, viu? Flagelo polar!', 'Meu verde vem da piocianina 😎', 'Achou que ia escapar?'];
    function chase() {
      if (!chasing) return;
      var now = Date.now();
      var tx = mx + 70, ty = my + 40;               // fica um pouco atrás do ponteiro
      if (now > until) { tx = window.innerWidth + 160; ty = y; } // vai embora
      var dx = tx - x, dy = ty - y, d = Math.hypot(dx, dy);
      var sp = Math.min(9, 2 + d * 0.04);
      if (d > 1) { x += dx / d * sp; y += dy / d * sp; }
      // o rosto está no lado esquerdo do desenho: indo para a direita, espelha
      if (Math.abs(dx) > 4) flip = dx > 0 ? -1 : 1;
      var tilt = Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI * (flip === -1 ? 1 : -1);
      tilt = Math.max(-35, Math.min(35, tilt));
      ang += (tilt - ang) * 0.12;
      place();
      if (now <= until && d < 60 && !sw.dataset.said) {
        sw.dataset.said = '1';
        say(phrases[runs % phrases.length], x, y);
      }
      if (now > until && x > window.innerWidth + 120) { chasing = false; sw.classList.remove('on'); return; }
      raf = requestAnimationFrame(chase);
    }
    function start() {
      if (document.hidden || !moved || runs >= 4) return;
      runs++; delete sw.dataset.said;
      x = -120; y = Math.max(80, Math.min(my, window.innerHeight - 80)); ang = 0; flip = -1;
      place(); sw.classList.add('on');
      chasing = true; until = Date.now() + 9000;
      cancelAnimationFrame(raf); raf = requestAnimationFrame(chase);
    }
    setTimeout(start, 6000);
    setInterval(function () { if (!chasing) start(); }, 35000);
  } else {
    // Celular: atravessa a tela uma vez, depois que a pessoa rola um pouco
    var done = false;
    window.addEventListener('scroll', function () {
      if (done || window.scrollY < 500) return;
      done = true;
      var t0 = performance.now(), dur = 6500, H = window.innerHeight, W = window.innerWidth;
      sw.style.width = '72px'; sw.classList.add('on');
      (function step(t) {
        var p = Math.min(1, (t - t0) / dur);
        x = W + 80 - p * (W + 200);
        y = H * 0.72 + Math.sin(p * Math.PI * 3) * 26;
        ang = Math.cos(p * Math.PI * 3) * 10;
        place();
        if (p < 1) requestAnimationFrame(step); else sw.classList.remove('on');
      })(t0);
    }, { passive: true });
  }
})();
