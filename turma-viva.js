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


  // ===== Comportamentos de cada mascote (passar o mouse no computador, tocar no celular) =====
  css.textContent +=
    '.tv-p{position:fixed;z-index:79;pointer-events:none;border-radius:50%}' +
    '[data-acao] img{transition:transform .5s cubic-bezier(.3,1.5,.5,1),filter .5s}' +
    '[data-acao].tv-esporo img{transform:scale(.45) rotate(-20deg);filter:drop-shadow(0 0 14px #ffd27a) brightness(1.15)}' +
    '[data-acao].tv-pigmento img{filter:drop-shadow(0 0 18px #2fe06a) drop-shadow(0 0 30px #8cff9e)}' +
    '[data-acao].tv-aceno img{animation:tv-wave .9s ease-in-out 2}' +
    '@keyframes tv-wave{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}' +
    '[data-acao].tv-agito img{animation:tv-shake .12s linear 8}' +
    '@keyframes tv-shake{0%,100%{transform:translateX(0)}50%{transform:translateX(4px) rotate(2deg)}}';

  function box(el) { return el.getBoundingClientRect(); }
  function particle(x, y, size, bg, anim, dur, extra) {
    if (reduce) return;
    var p = document.createElement('div');
    p.className = 'tv-p';
    p.style.cssText += 'left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px;background:' + bg + ';' + (extra || '');
    document.body.appendChild(p);
    var a = p.animate(anim, { duration: dur, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    a.onfinish = function () { p.remove(); };
  }
  var R = function (a, b) { return a + Math.random() * (b - a); };

  var ACOES = {
    // Aspergillus: solta uma nuvem de esporos pretos que flutuam e somem
    esporos: function (el) {
      var r = box(el), x = r.left + r.width * .78, y = r.top + r.height * .12;
      for (var i = 0; i < 26; i++) {
        var dx = R(-110, 130), dy = R(-140, 30), s = R(4, 9);
        particle(x, y, s, 'radial-gradient(circle at 35% 30%,#7d8799,#1b1f27)',
          [{ transform: 'translate(0,0) scale(.4)', opacity: 1 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1)', opacity: .9, offset: .6 }, { transform: 'translate(' + (dx * 1.3) + 'px,' + (dy * 1.3 - 40) + 'px) scale(.8)', opacity: 0 }],
          R(1600, 2600));
      }
    },
    // S. aureus ("dourado"): brilhos dourados saindo dos cocos
    dourado: function (el) {
      var r = box(el), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (var i = 0; i < 26; i++) {
        var a = Math.random() * 6.283, d = R(60, 150);
        particle(cx, cy, R(14, 24), '#ffc61a', [{ transform: 'translate(0,0) scale(.2) rotate(0)', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px) scale(1) rotate(180deg)', opacity: 0 }],
          R(1200, 1900), 'border-radius:2px;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);box-shadow:0 0 8px #ffd96b');
      }
    },
    // Bacillus: vira esporo (encolhe e brilha de calor) e depois volta
    esporo: function (el) {
      el.classList.add('tv-esporo');
      var r = box(el);
      for (var i = 0; i < 8; i++) particle(r.left + r.width / 2 + R(-40, 40), r.top + r.height * .6, R(16, 26), 'radial-gradient(circle,rgba(255,170,60,.45),rgba(255,170,60,0) 70%)',
        [{ transform: 'translateY(0)', opacity: .9 }, { transform: 'translateY(-70px)', opacity: 0 }], R(900, 1400));
      setTimeout(function () { el.classList.remove('tv-esporo'); }, 1500);
    },
    // Candida: brota uma levedura-filha que se solta e sai flutuando
    broto: function (el) {
      if (reduce) return;
      var r = box(el), img = document.createElement('img');
      img.src = (el.querySelector('img') || el).getAttribute('src');
      img.alt = '';
      var bw = r.width * .55, bh = bw * 300 / 420;
      img.style.cssText = 'position:fixed;z-index:79;pointer-events:none;width:' + bw + 'px;left:' + (r.left + r.width * .77 - bw * .2) + 'px;top:' + (r.top + r.height * .35 - bh * .8) + 'px;transform-origin:20% 80%;filter:drop-shadow(0 0 1.5px rgba(8,40,63,.45)) drop-shadow(0 10px 12px rgba(8,40,63,.25))';
      for (var k = 0; k < 10; k++) { var an = k / 10 * 6.283; particle(r.left + r.width * .77, r.top + r.height * .35, 8, '#10a8b8', [{ transform: 'translate(0,0) scale(1)', opacity: .9 }, { transform: 'translate(' + Math.cos(an) * 46 + 'px,' + Math.sin(an) * 46 + 'px) scale(.3)', opacity: 0 }], 700); }
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08,.92)' }, { transform: 'scale(1)' }], { duration: 500 });
      document.body.appendChild(img);
      var a = img.animate([{ transform: 'scale(0)', opacity: 1, easing: 'cubic-bezier(.3,1.6,.5,1)' }, { transform: 'scale(1.05)', opacity: 1, offset: .3 }, { transform: 'scale(1)', opacity: 1, offset: .45 }, { transform: 'translate(60px,-80px) rotate(20deg) scale(.95)', opacity: 1, offset: .8 }, { transform: 'translate(90px,-120px) rotate(30deg) scale(.85)', opacity: 0 }],
        { duration: 2600, easing: 'linear', fill: 'forwards' });
      a.onfinish = function () { img.remove(); };
    },
    // Pseudomonas: brilho verde de piocianina
    pigmento: function (el) {
      el.classList.add('tv-pigmento');
      setTimeout(function () { el.classList.remove('tv-pigmento'); }, 1400);
    },
    // E. coli e Salmonella: agitam os flagelos e soltam bolhinhas
    agito: function (el) {
      el.classList.remove('tv-agito'); void el.offsetWidth; el.classList.add('tv-agito');
      var r = box(el);
      for (var i = 0; i < 7; i++) particle(r.left + R(10, r.width - 10), r.top + r.height * .7, R(6, 12), 'rgba(255,255,255,.75)',
        [{ transform: 'translateY(0)', opacity: .9 }, { transform: 'translate(' + R(-20, 20) + 'px,-80px)', opacity: 0 }], R(900, 1500), 'border:1.5px solid rgba(16,168,184,.6)');
      setTimeout(function () { el.classList.remove('tv-agito'); }, 1000);
    },
    // Mascote azul: dá tchau
    aceno: function (el) {
      el.classList.remove('tv-aceno'); void el.offsetWidth; el.classList.add('tv-aceno');
      setTimeout(function () { el.classList.remove('tv-aceno'); }, 1900);
    }
  };

  document.querySelectorAll('[data-acao]').forEach(function (el) {
    var fn = ACOES[el.getAttribute('data-acao')], last = 0;
    if (!fn) return;
    function go() { var n = Date.now(); if (n - last < 2200) return; last = n; fn(el); }
    if (fine) el.addEventListener('mouseenter', go);
    el.addEventListener('click', go);
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
