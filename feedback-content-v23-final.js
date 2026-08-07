(() => {
  'use strict';

  const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/D8vwzdVgaLp2FRYySflJYL?s=cl&p=a&ilr=1';

  const updatePurposeStatement = () => {
    const intro = document.querySelector('#briefing .purpose-heading > p:last-child');
    if (!intro) return;

    intro.innerHTML = 'We are bringing people living with type 2 diabetes together to take action and inspire people to improve<br><span class="purpose-second-line-v23">metabolic health and eventually reach diabetes remission.</span>';
  };

  const updateParticipantQuote = () => {
    const quote = [...document.querySelectorAll('.participant-quotes blockquote')]
      .find(node => /my family/i.test(node.textContent || ''));

    if (quote) {
      quote.textContent = '“I want my family to see what consistent effort can result into.”';
    }
  };

  const updateFooterWhatsApp = () => {
    const links = [...document.querySelectorAll('.footer-v11-links a')];
    const whatsappLink = links.find(link => /whatsapp/i.test(link.querySelector('small')?.textContent || ''));
    if (!whatsappLink) return;

    whatsappLink.href = WHATSAPP_GROUP_URL;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.setAttribute('aria-label', 'Join the expedition WhatsApp group');

    const label = whatsappLink.querySelector('strong');
    if (label) label.textContent = 'Join the WhatsApp group';
  };

  const run = () => {
    if (document.body?.classList.contains('application-page')) return;

    updatePurposeStatement();
    updateParticipantQuote();
    updateFooterWhatsApp();
    document.documentElement.classList.add('landing-final-v23-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
