/* ═══════════════════════════════════════════════════════════
   RefreshP — before-after.js
   Comparison slider — home page + gallery page instances
   ═══════════════════════════════════════════════════════════ */

/* ── Home page BA slider ── */
(function () {
  const slider  = document.getElementById('baSlider');
  if (!slider) return;

  const handle  = document.getElementById('baHandle');
  const afterEl = slider.querySelector('.ba-after');
  let isDragging = false;
  let pos        = 0.5;

  const scenes = {
    kitchen: {
      before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
      after:  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1400&q=80',
    },
    living: {
      before: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80',
      after:  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&q=80',
    },
    bedroom: {
      before: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=80',
      after:  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80',
    },
  };

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    pos = Math.max(0.05, Math.min(0.95, (x - rect.left) / rect.width));
    const pct = pos * 100;
    afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = pct + '%';
  }

  slider.addEventListener('mousedown', e => { isDragging = true; setPos(e.clientX); });
  window.addEventListener('mousemove', e => { if (isDragging) setPos(e.clientX); });
  window.addEventListener('mouseup',   () => { isDragging = false; });
  slider.addEventListener('touchstart', e => { isDragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   () => { isDragging = false; });

  setPos(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * 0.5);

  document.querySelectorAll('.ba-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ba-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scene = scenes[btn.dataset.scene];
      if (!scene) return;
      const beforeImg = document.getElementById('baBeforeImg');
      const afterImg  = document.getElementById('baAfterImg');
      slider.style.opacity    = '0';
      slider.style.transition = 'opacity 300ms ease';
      setTimeout(() => {
        beforeImg.src = scene.before;
        afterImg.src  = scene.after;
        pos = 0.5;
        setPos(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * 0.5);
        slider.style.opacity = '1';
      }, 300);
    });
  });
})();

/* ── Gallery page BA slider ── */
(function () {
  const slider = document.getElementById('galleryBASlider');
  if (!slider) return;

  const handle  = document.getElementById('galleryBAHandle');
  const afterEl = slider.querySelector('.ba-after');
  let isDragging = false;

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    const pos  = Math.max(0.04, Math.min(0.96, (x - rect.left) / rect.width));
    afterEl.style.clipPath = `inset(0 0 0 ${pos * 100}%)`;
    handle.style.left      = pos * 100 + '%';
  }

  slider.addEventListener('mousedown',  e => { isDragging = true; setPos(e.clientX); });
  window.addEventListener('mousemove',  e => { if (isDragging) setPos(e.clientX); });
  window.addEventListener('mouseup',    () => { isDragging = false; });
  slider.addEventListener('touchstart', e => { isDragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   () => { isDragging = false; });

  setTimeout(() => {
    setPos(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * 0.5);
  }, 100);
})();
