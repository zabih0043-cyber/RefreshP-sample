/* ═══════════════════════════════════════════════════════════
   RefreshP — animations.js
   scroll-reveal · counters · timelines · map animations
   ═══════════════════════════════════════════════════════════ */

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── CTA line animations (home, about, gallery variants) ── */
document.querySelectorAll('.cta-band__line, .about-cta-band__line, .gallery-cta-band__line').forEach(line => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { line.classList.add('is-visible'); obs.unobserve(line); }
    });
  }, { threshold: 0.5 });
  obs.observe(line);
});

/* ── Counter animation ── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat__number');
if (statNumbers.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));
}

/* ── Services horizontal timeline draw ── */
(function () {
  const timelineLine = document.getElementById('timelineLine');
  const nodes        = document.querySelectorAll('.timeline__node');
  if (!timelineLine) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineLine.classList.add('is-drawn');
        nodes.forEach((node, i) => {
          setTimeout(() => node.classList.add('is-active'), i * 260);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(timelineLine.closest('.timeline') || timelineLine);
})();

/* ── About vertical timeline draw ── */
(function () {
  const vtLine = document.getElementById('vtLine');
  if (!vtLine) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        vtLine.classList.add('is-drawn');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(vtLine.closest('.vt-timeline') || vtLine);
})();

/* ── About map pin interactions ── */
(function () {
  const pinData = {
    'pin-manchester': 'Manchester',
  };

  Object.entries(pinData).forEach(([id, _city]) => {
    const pin = document.getElementById(id);
    if (!pin) return;

    pin.style.cursor = 'pointer';
    pin.addEventListener('mouseenter', () => {
      const dot = pin.querySelector('.map-pin__dot');
      if (dot) dot.setAttribute('r', '9');
    });
    pin.addEventListener('mouseleave', () => {
      const dot = pin.querySelector('.map-pin__dot');
      if (dot) dot.setAttribute('r', '7');
    });
    pin.addEventListener('click', () => {
      document.querySelectorAll('.city-card').forEach(card => {
        card.style.opacity = '0.4';
      });
      const cards = document.querySelectorAll('.city-card');
      const index = Object.keys(pinData).indexOf(id);
      if (cards[index]) {
        cards[index].style.opacity = '1';
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => {
          document.querySelectorAll('.city-card').forEach(c => c.style.opacity = '');
        }, 2000);
      }
    });
  });
})();

/* ── Contact map SVG zoom-in on scroll ── */
(function () {
  const mapSvg = document.getElementById('contactMapSvg');
  if (!mapSvg) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        mapSvg.classList.add('is-visible');
        obs.unobserve(mapSvg);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(mapSvg);
})();
