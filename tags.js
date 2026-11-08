/* Tags do Google (Ads + GA4) da RBio, compartilhadas por todas as páginas.
   Carregar sem defer, logo após o gtag.js, para que gtag() exista antes dos outros scripts. */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
// Consentimento: nenhum cookie de medição é gravado até o visitante aceitar (ver cookies.js).
gtag('consent', 'default', {'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied', 'analytics_storage': 'denied'});
try {
  if (localStorage.getItem('rbio_cookie_consent') === 'granted') {
    gtag('consent', 'update', {'ad_storage': 'granted', 'ad_user_data': 'granted', 'ad_personalization': 'granted', 'analytics_storage': 'granted'});
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', 'AW-18527985961');
gtag('config', 'G-2LNESDRK3G');
// Registra cliques que levam ao WhatsApp como conversões do Google Ads.
document.addEventListener('click', function(event) {
  var link = event.target.closest('a[href*="wa.me/"], a[href*="api.whatsapp.com/"], a[href*="whatsapp.com/"]');
  if (!link) return;
  gtag('event', 'conversion', {
    'send_to': 'AW-18527985961/i7MJCJrt86MdEKnC6oJF',
    'transport_type': 'beacon'
  });
  gtag('event', 'generate_lead', {'method': 'whatsapp'});
});
// Ads + GA4: cliques no e-mail comercial.
document.addEventListener('click', function(event) {
  if (event.target.closest('a[href^="mailto:"]')) {
    gtag('event', 'conversion', {'send_to': 'AW-18527985961/i7MJCJrt86MdEKnC6oJF', 'transport_type': 'beacon'});
    gtag('event', 'generate_lead', {'method': 'email'});
  }
});

// Lead gerado por script (formulários que abrem o WhatsApp ou enviam cadastro):
// registra a conversão no Google Ads e o evento generate_lead no GA4.
function rbioLead(method) {
  gtag('event', 'conversion', {'send_to': 'AW-18527985961/i7MJCJrt86MdEKnC6oJF', 'transport_type': 'beacon'});
  gtag('event', 'generate_lead', {'method': method});
}
