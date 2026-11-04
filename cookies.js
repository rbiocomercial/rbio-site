/* Aviso de cookies da RBio: guarda a escolha no navegador e informa o Google (Consent Mode). */
(function () {
  var KEY = 'rbio_cookie_consent';
  var box = null;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function update(v) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    }
  }
  function setOffset() {
    document.documentElement.style.setProperty('--cookie-h', box ? box.offsetHeight + 'px' : '0px');
  }
  function close() {
    if (box) { box.parentNode.removeChild(box); box = null; }
    setOffset();
  }
  function choose(v) { save(v); update(v); close(); }

  function open() {
    if (box) return;
    box = document.createElement('div');
    box.className = 'cookie-banner';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Usamos cookies do Google (Analytics e Ads) para medir o uso do site e o desempenho dos anúncios. ' +
      'Você escolhe se aceita. Saiba mais na <a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" data-c="denied">Recusar</button>' +
      '<button type="button" data-c="granted">Aceitar</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-c]');
      if (b) choose(b.getAttribute('data-c'));
    });
    document.body.appendChild(box);
    setOffset();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-prefs]')) { e.preventDefault(); open(); }
  });
  window.addEventListener('resize', function () { if (box) setOffset(); });

  if (read() === null) open();
})();
