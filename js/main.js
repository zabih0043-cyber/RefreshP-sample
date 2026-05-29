/* ═══════════════════════════════════════════════════════════
   RefreshP — main.js
   nav scroll · mobile menu · sticky nav · filter bar offset
   ═══════════════════════════════════════════════════════════ */

/* ── Header scroll behaviour ── */
const header = document.getElementById('siteHeader');
if (header) {
  if (!header.classList.contains('scrolled')) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }
}

/* ── Mobile menu ── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (hamburger && mobileMenu && mobileClose) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  mobileClose.addEventListener('click', closeMobileMenu);
  mobileMenu.addEventListener('click', e => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
}
function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Services sticky nav: adjust top offset based on header height ── */
(function () {
  const serviceNav = document.getElementById('serviceNav');
  if (!serviceNav) return;

  function updateNavTop() {
    const h = document.getElementById('siteHeader');
    serviceNav.style.top = (h ? h.offsetHeight : 72) + 'px';
  }
  updateNavTop();
  window.addEventListener('resize', updateNavTop);
  window.addEventListener('scroll', updateNavTop, { passive: true });
})();

/* ── Services nav pill smooth-scroll + active state ── */
(function () {
  const pills    = document.querySelectorAll('.service-nav__pill');
  const sections = ['assessment', 'refreshment', 'reassessment'].map(id => document.getElementById(id));
  const nav      = document.getElementById('serviceNav');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const target = document.getElementById(pill.dataset.target);
      if (!target) return;
      const navH    = nav ? nav.offsetHeight : 0;
      const headerH = document.getElementById('siteHeader')?.offsetHeight || 72;
      const top     = target.getBoundingClientRect().top + window.scrollY - navH - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  function updateActive() {
    const navH    = nav ? nav.offsetHeight : 0;
    const headerH = document.getElementById('siteHeader')?.offsetHeight || 72;
    const offset  = navH + headerH + 40;
    let current   = null;
    sections.forEach(section => {
      if (!section) return;
      if (section.getBoundingClientRect().top <= offset) current = section.id;
    });
    pills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.target === current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ── Gallery filter bar top offset ── */
(function () {
  const filterBar = document.getElementById('filterBar');
  if (!filterBar) return;
  function updateTop() {
    const h = document.getElementById('siteHeader');
    filterBar.style.top = (h ? h.offsetHeight : 72) + 'px';
  }
  updateTop();
  window.addEventListener('resize', updateTop);
  window.addEventListener('scroll', updateTop, { passive: true });
})();
