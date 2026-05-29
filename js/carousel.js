/* ═══════════════════════════════════════════════════════════
   RefreshP — carousel.js
   Swiper testimonials carousel
   ═══════════════════════════════════════════════════════════ */

if (typeof Swiper !== 'undefined') {
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: true,
    autoplay: { delay: 6000, pauseOnMouseEnter: true, disableOnInteraction: false },
    pagination: { el: '.testimonials-pagination', clickable: true },
    breakpoints: {
      640:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}
