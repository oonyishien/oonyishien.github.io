/* Yi Shien Oon — shared behaviour for every page */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* Mobile menu */
  const btn = $('.menu-btn'), nav = $('#site-nav');
  if (btn && nav) btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? 'Close' : 'Menu';
  });

  /* Scroll progress + back-to-top */
  const bar = $('.progress'), top = $('.totop');
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%';
    if (top) top.classList.toggle('show', h.scrollTop > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (top) top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  /* Reveal on scroll */
  const sel = [
    '.sec-head', '.pillar', '.life', '.timeline .role', '.cred-card', '.beyond a', '.quote', '.cta', '.now-grid > *', '.platforms',
    'body.inner .section-title', 'body.inner main > h2', 'body.inner section:not(.hero) > h2',
    'body.inner .card', 'body.inner .timeline-item', 'body.inner .award-card', 'body.inner .edu-card',
    'body.inner .exp', 'body.inner .item'
  ].join(',');
  const els = $$(sel).filter(el => !el.closest('.hero'));
  if (!reduced && 'IntersectionObserver' in window) {
    els.forEach(el => {
      el.classList.add('reveal');
      const sib = [...el.parentElement.children].filter(c => c.tagName === el.tagName);
      const i = sib.indexOf(el) % 4; if (i > 0) el.classList.add('d' + i);
    });
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; el.classList.add('in'); io.unobserve(el);
      // hand control back to the element's own hover transitions once revealed
      setTimeout(() => el.classList.remove('reveal', 'in', 'd1', 'd2', 'd3'), 1000);
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* Cursor spotlight on cards */
  $$('.pillar, .beyond a, .cred-card, body.inner .card, body.inner .award-card, body.inner .edu-card, body.inner .exp, body.inner .timeline-item').forEach(el => {
    el.classList.add('spot');
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
