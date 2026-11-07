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
    '.tv-p{position:fixed;z-index:79;pointer-events:none;border-radius:50%;will-change:transform,opacity}' +
    '[data-acao] img{transition:transform .6s cubic-bezier(.34,1.56,.64,1),filter .6s ease}' +
    '[data-acao].tv-esporo img{transform:scale(.42) rotate(-24deg);filter:drop-shadow(0 0 10px rgba(255,190,90,.95)) drop-shadow(0 0 26px rgba(255,140,40,.6)) brightness(1.12) saturate(1.2)}' +
    '[data-acao].tv-pigmento img{animation:tv-pyo 1.6s ease-in-out}' +
    '@keyframes tv-pyo{0%,100%{filter:drop-shadow(0 0 0 rgba(47,224,106,0))}35%{filter:drop-shadow(0 0 14px rgba(47,224,106,.95)) drop-shadow(0 0 34px rgba(120,255,150,.65)) saturate(1.3) brightness(1.08)}70%{filter:drop-shadow(0 0 8px rgba(47,224,106,.6)) drop-shadow(0 0 20px rgba(120,255,150,.35))}}' +
    '[data-acao].tv-aceno img{animation:tv-wave 1s cubic-bezier(.45,0,.55,1) 2;transform-origin:50% 90%}' +
    '@keyframes tv-wave{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg) translateY(-3px)}75%{transform:rotate(9deg) translateY(-3px)}}' +
    '[data-acao].tv-agito img{animation:tv-shake .5s cubic-bezier(.36,.07,.19,.97) 2}' +
    '@keyframes tv-shake{10%,90%{transform:translateX(-1px) rotate(-1deg)}20%,80%{transform:translateX(3px) rotate(1.5deg)}30%,50%,70%{transform:translateX(-4px) rotate(-2deg)}40%,60%{transform:translateX(4px) rotate(2deg)}}' +
    '[data-acao].tv-squash img{animation:tv-squash .55s cubic-bezier(.34,1.56,.64,1)}' +
    '@keyframes tv-squash{0%{transform:scale(1)}35%{transform:scale(1.1,.88)}70%{transform:scale(.96,1.05)}100%{transform:scale(1)}}';

  var R = function (a, b) { return a + Math.random() * (b - a); };
  function box(el) { var i = el.querySelector('img') || el; return i.getBoundingClientRect(); }
  function particle(x, y, size, style, frames, dur, delay, ease) {
    if (reduce) return;
    var p = document.createElement('div');
    p.className = 'tv-p';
    p.style.cssText += 'left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px;opacity:0;' + style;
    document.body.appendChild(p);
    var an = p.animate(frames, { duration: dur, delay: delay || 0, easing: ease || 'cubic-bezier(.22,.61,.36,1)', fill: 'both' });
    an.onfinish = function () { p.remove(); };
  }
  function ring(x, y, size, color, dur, delay, width) {
    particle(x, y, size, 'border:' + (width || 3) + 'px solid ' + color + ';box-shadow:0 0 12px ' + color,
      [{ transform: 'scale(.2)', opacity: .9 }, { transform: 'scale(1)', opacity: 0 }], dur, delay, 'cubic-bezier(.16,1,.3,1)');
  }
  function bump(el, cls, ms) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(function () { el.classList.remove(cls); }, ms); }
  var STAR = 'clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);border-radius:0;';

  var ACOES = {
    // Aspergillus: o conidióforo solta uma nuvem de esporos que deriva com o ar
    esporos: function (el) {
      var r = box(el), x = r.left + r.width * .73, y = r.top + r.height * .1;
      bump(el, 'tv-squash', 600);
      for (var i = 0; i < 42; i++) {
        var dx = R(-60, 140), dy = R(-150, -20), s = R(3, 10), w = R(-30, 30);
        particle(x + R(-8, 8), y + R(-8, 8), s,
          'background:radial-gradient(circle at 32% 28%,#a4adbd 0,#4a5262 45%,#14171d 100%);filter:blur(' + (s < 5 ? .6 : 0) + 'px)',
          [{ transform: 'translate(0,0) scale(.3)', opacity: 0 },
           { transform: 'translate(' + dx * .35 + 'px,' + dy * .45 + 'px) scale(1)', opacity: .95, offset: .25 },
           { transform: 'translate(' + (dx * .7 + w) + 'px,' + dy * .8 + 'px) scale(.95)', opacity: .8, offset: .6 },
           { transform: 'translate(' + (dx + w * 1.6) + 'px,' + (dy - 40) + 'px) scale(.7)', opacity: 0 }],
          R(2200, 3400), i * 18, 'cubic-bezier(.25,.46,.45,.94)');
      }
    },
    // S. aureus ("dourado"): halo dourado e estrelinhas que piscam
    dourado: function (el) {
      var r = box(el), cx = r.left + r.width / 2, cy = r.top + r.height * .55;
      bump(el, 'tv-squash', 600);
      ring(cx, cy, r.width * 1.1, 'rgba(255,200,60,.85)', 900, 0, 4);
      ring(cx, cy, r.width * .8, 'rgba(255,220,120,.7)', 900, 140, 2);
      for (var i = 0; i < 22; i++) {
        var a = R(0, 6.283), d = R(r.width * .35, r.width * .8), s = R(10, 22);
        particle(cx + Math.cos(a) * d * .3, cy + Math.sin(a) * d * .3, s,
          STAR + 'background:linear-gradient(135deg,#fff7c2,#ffc61a 55%,#e89b00);filter:drop-shadow(0 0 4px rgba(255,200,40,.9))',
          [{ transform: 'translate(0,0) scale(0) rotate(0)', opacity: 0 },
           { transform: 'translate(' + Math.cos(a) * d * .7 + 'px,' + Math.sin(a) * d * .7 + 'px) scale(1.25) rotate(45deg)', opacity: 1, offset: .35 },
           { transform: 'translate(' + Math.cos(a) * d * .85 + 'px,' + Math.sin(a) * d * .85 + 'px) scale(.55) rotate(70deg)', opacity: .8, offset: .55 },
           { transform: 'translate(' + Math.cos(a) * d * .95 + 'px,' + Math.sin(a) * d * .95 + 'px) scale(1) rotate(100deg)', opacity: 1, offset: .75 },
           { transform: 'translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d - 20) + 'px) scale(0) rotate(140deg)', opacity: 0 }],
          R(1300, 1900), i * 25);
      }
    },
    // Bacillus: esporula — encolhe, brilha de calor, ondas de calor sobem, e volta
    esporo: function (el) {
      var r = box(el), cx = r.left + r.width / 2, cy = r.top + r.height * .5;
      el.classList.add('tv-esporo');
      ring(cx, cy, r.width * .9, 'rgba(255,170,60,.8)', 1000, 150, 3);
      for (var i = 0; i < 14; i++) {
        var s = R(18, 34);
        particle(cx + R(-r.width * .3, r.width * .3), cy + R(0, 20), s,
          'background:radial-gradient(circle,rgba(255,190,90,.55),rgba(255,140,40,0) 70%);filter:blur(2px)',
          [{ transform: 'translate(0,0) scale(.6)', opacity: 0 }, { transform: 'translate(' + R(-10, 10) + 'px,-40px) scale(1)', opacity: .9, offset: .3 }, { transform: 'translate(' + R(-25, 25) + 'px,-110px) scale(1.4)', opacity: 0 }],
          R(1200, 1700), i * 60);
      }
      setTimeout(function () { el.classList.remove('tv-esporo'); ring(cx, cy, r.width * .7, 'rgba(255,255,255,.9)', 600, 0, 2); }, 1700);
    },
    // Candida: brotamento — a levedura-filha cresce, se solta e vai embora
    broto: function (el) {
      if (reduce) return;
      var r = box(el), img = document.createElement('img');
      img.src = (el.querySelector('img') || el).getAttribute('src');
      img.alt = '';
      var bw = r.width * .55, bh = bw * 300 / 420, bx = r.left + r.width * .77, by = r.top + r.height * .35;
      img.style.cssText = 'position:fixed;z-index:79;pointer-events:none;width:' + bw + 'px;left:' + (bx - bw * .2) + 'px;top:' + (by - bh * .8) + 'px;transform-origin:20% 80%;filter:drop-shadow(0 0 1.5px rgba(8,40,63,.4)) drop-shadow(0 10px 14px rgba(8,40,63,.22))';
      bump(el, 'tv-squash', 600);
      for (var k = 0; k < 12; k++) {
        var an = k / 12 * 6.283;
        particle(bx, by, 7, 'background:radial-gradient(circle at 35% 30%,#fff,#10a8b8)',
          [{ transform: 'translate(0,0) scale(1)', opacity: 0 }, { transform: 'translate(' + Math.cos(an) * 20 + 'px,' + Math.sin(an) * 20 + 'px) scale(1)', opacity: 1, offset: .3 }, { transform: 'translate(' + Math.cos(an) * 50 + 'px,' + Math.sin(an) * 50 + 'px) scale(.2)', opacity: 0 }], 800, 250);
      }
      document.body.appendChild(img);
      var a = img.animate([
        { transform: 'scale(0)', opacity: 1, easing: 'cubic-bezier(.34,1.56,.64,1)' },
        { transform: 'scale(1)', opacity: 1, offset: .35, easing: 'ease-in-out' },
        { transform: 'translate(12px,-14px) rotate(8deg) scale(1)', opacity: 1, offset: .5, easing: 'ease-out' },
        { transform: 'translate(70px,-90px) rotate(22deg) scale(.95)', opacity: 1, offset: .82 },
        { transform: 'translate(100px,-130px) rotate(30deg) scale(.85)', opacity: 0 }],
        { duration: 2800, easing: 'linear', fill: 'forwards' });
      a.onfinish = function () { img.remove(); };
    },
    // Pseudomonas: pulso verde de piocianina
    pigmento: function (el) {
      var r = box(el), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      bump(el, 'tv-pigmento', 1700);
      ring(cx, cy, r.width * 1.05, 'rgba(47,224,106,.7)', 1100, 100, 3);
      ring(cx, cy, r.width * 1.35, 'rgba(120,255,150,.45)', 1300, 350, 2);
    },
    // E. coli e Salmonella: batem os flagelos e soltam bolhas
    agito: function (el) {
      var r = box(el);
      bump(el, 'tv-agito', 1050);
      for (var i = 0; i < 10; i++) {
        var s = R(7, 15);
        particle(r.left + R(r.width * .15, r.width * .85), r.top + r.height * .65, s,
          'background:radial-gradient(circle at 30% 28%,#fff 0,rgba(255,255,255,.55) 35%,rgba(160,230,240,.25) 70%,rgba(16,168,184,.35) 100%);box-shadow:inset 0 0 0 1px rgba(16,168,184,.45)',
          [{ transform: 'translate(0,0) scale(.4)', opacity: 0 },
           { transform: 'translate(' + R(-8, 8) + 'px,-30px) scale(1)', opacity: 1, offset: .25 },
           { transform: 'translate(' + R(-16, 16) + 'px,-70px) scale(1)', opacity: .9, offset: .7 },
           { transform: 'translate(' + R(-20, 20) + 'px,-100px) scale(1.25)', opacity: 0 }],
          R(1100, 1700), i * 70, 'cubic-bezier(.33,1,.68,1)');
      }
    },
    // Giardia: movimento de 'folha caindo' (balança e gira suavemente)
    folha: function (el) {
      var i = el.querySelector('img') || el;
      i.animate([{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(-14px,6px) rotate(-18deg)', offset: .2 }, { transform: 'translate(12px,14px) rotate(16deg)', offset: .45 },
        { transform: 'translate(-10px,20px) rotate(-12deg)', offset: .7 }, { transform: 'translate(0,0) rotate(0)' }], { duration: 2000, easing: 'cubic-bezier(.45,0,.55,1)' });
      var r = box(el);
      for (var k = 0; k < 4; k++) particle(r.left + r.width / 2, r.top + r.height * .55, r.width * .7, 'border:2px solid rgba(255,156,192,.6)',
        [{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(.7)', opacity: .8, offset: .3 }, { transform: 'scale(1.2)', opacity: 0 }], 1100, k * 350, 'ease-out');
    },
    // Mascote azul: dá tchau
    aceno: function (el) { bump(el, 'tv-aceno', 2100); }
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
