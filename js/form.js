/* ═══════════════════════════════════════════════════════════
   RefreshP — form.js
   contact form · FAQ accordion · gallery filter · lightbox
   ═══════════════════════════════════════════════════════════ */

/* ── Select floating label ── */
(function () {
  document.querySelectorAll('.form-select').forEach(select => {
    function update() {
      select.classList.toggle('has-value', select.value !== '');
    }
    select.addEventListener('change', update);
    update();
  });
})();

/* ── Form validation & submission ── */
(function () {
  const form         = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formState    = document.getElementById('formState');
  const successState = document.getElementById('successState');
  const successIcon  = document.getElementById('successIcon');
  if (!form) return;

  function showFieldError(field, show) {
    field.classList.toggle('is-error', show);
  }

  function validateForm() {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const empty = !field.value.trim();
      showFieldError(field, empty);
      if (empty) valid = false;
    });
    const email = form.querySelector('#email');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showFieldError(email, true);
      valid = false;
    }
    return valid;
  }

  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input',  () => showFieldError(input, false));
    input.addEventListener('change', () => showFieldError(input, false));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      formState.style.opacity   = '0';
      formState.style.transform = 'translateY(-8px)';

      setTimeout(() => {
        formState.style.display   = 'none';
        successState.classList.add('is-visible');
        successState.style.opacity   = '0';
        successState.style.transform = 'translateY(8px)';

        requestAnimationFrame(() => {
          successState.style.transition = 'opacity 400ms ease, transform 400ms ease';
          successState.style.opacity    = '1';
          successState.style.transform  = 'translateY(0)';
          setTimeout(() => successIcon.classList.add('is-animated'), 100);
        });

        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }, 350);
    }, 1400);
  });
})();

/* ── FAQ Accordion ── */
(function () {
  const triggers = document.querySelectorAll('.faq-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isOpen  = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel   = document.getElementById(panelId);
      if (!panel) return;

      triggers.forEach(other => {
        if (other === trigger) return;
        other.setAttribute('aria-expanded', 'false');
        const op = document.getElementById(other.getAttribute('aria-controls'));
        if (op) op.style.maxHeight = '0';
      });

      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();

/* ── Gallery masonry filter ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tiles      = Array.from(document.querySelectorAll('.masonry-tile'));
  const emptyState = document.getElementById('galleryEmpty');
  if (!filterBtns.length) return;
  let currentFilter = 'all';

  function showTiles() {
    const visible = tiles.filter(t => !t.classList.contains('is-hidden'));
    if (emptyState) emptyState.style.display = visible.length === 0 ? 'block' : 'none';
    visible.forEach((tile, i) => {
      tile.style.animationDelay = `${i * 60}ms`;
      tile.classList.add('is-fade-in');
    });
  }

  function applyFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));

    const toHide = tiles.filter(t => !t.classList.contains('is-hidden'));
    if (toHide.length === 0) { showTiles(); return; }

    toHide.forEach(t => t.classList.add('is-fade-out'));

    setTimeout(() => {
      tiles.forEach(t => {
        t.classList.remove('is-fade-out', 'is-fade-in', 'is-hidden');
        if (filter !== 'all' && t.dataset.category !== filter) t.classList.add('is-hidden');
      });
      showTiles();
    }, 380);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.filter === currentFilter) return;
      applyFilter(btn.dataset.filter);
    });
  });

  /* Initial stagger on load */
  tiles.forEach((tile, i) => {
    tile.style.animationDelay = `${i * 50}ms`;
    tile.classList.add('is-fade-in');
  });
})();

/* ── Gallery lightbox ── */
(function () {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbLabel   = document.getElementById('lightboxLabel');
  const lbCounter = document.getElementById('lightboxCounter');
  const lbClose   = document.getElementById('lightboxClose');
  const lbPrev    = document.getElementById('lightboxPrev');
  const lbNext    = document.getElementById('lightboxNext');
  if (!lightbox) return;

  const tiles = Array.from(document.querySelectorAll('.masonry-tile'));
  let currentIndex = 0;

  function getVisibleTiles() {
    return tiles.filter(t => !t.classList.contains('is-hidden'));
  }

  function openLightbox(index) {
    const visible = getVisibleTiles();
    if (!visible[index]) return;
    currentIndex = index;
    const tile  = visible[index];
    const img   = tile.querySelector('img');
    const label = tile.querySelector('.masonry-tile__label');
    lbImg.src             = img.src.replace(/w=\d+/, 'w=1400');
    lbImg.alt             = img.alt;
    lbLabel.textContent   = label ? label.textContent : '';
    lbCounter.textContent = `${index + 1} / ${visible.length}`;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    const visible = getVisibleTiles();
    const next    = (currentIndex + dir + visible.length) % visible.length;
    lbImg.classList.add('is-switching');
    setTimeout(() => {
      lbImg.classList.remove('is-switching');
      openLightbox(next);
    }, 230);
  }

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const visible = getVisibleTiles();
      const idx     = visible.indexOf(tile);
      if (idx !== -1) openLightbox(idx);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => navigate(-1));
  lbNext.addEventListener('click',  () => navigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  }, { passive: true });
})();

/* ── URL param: pre-select service from ?quote=1 ── */
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.has('quote')) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
      serviceSelect.value = 'assessment';
      serviceSelect.classList.add('has-value');
      setTimeout(() => {
        document.getElementById('contactForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  }
})();
