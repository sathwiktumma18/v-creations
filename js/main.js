/* ============================================
   V CREATIONS — Main Entry
   Loader, init all modules, form handler
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ── */
  const loader = document.querySelector('.loader');
  const heroVideo = document.querySelector('.hero__video-bg video');
  document.body.classList.add('no-scroll');

  const minWait = new Promise(r => setTimeout(r, 2200));
  const videoReady = new Promise(r => {
    if (!heroVideo) return r();
    if (heroVideo.readyState >= 2) return r();
    heroVideo.addEventListener('canplay', r, { once: true });
    setTimeout(r, 5000); // fallback
  });

  Promise.all([minWait, videoReady]).then(() => {
    loader.classList.add('done');
    document.body.classList.remove('no-scroll');
    document.body.classList.add('loaded');
  });

  /* ── Init Modules ── */
  new Navigation();
  new ScrollReveal();
  new Gallery();
  new AlbumCarousel();
  new CustomCursor();

  /* ── Smooth scroll for all # links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      if (link.classList.contains('nav__link')) return; // handled by Nav
      const href = link.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const nav = document.querySelector('.nav');
        const offset = nav ? nav.offsetHeight : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── Contact Form → WhatsApp ── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const msg = [
        `Hi Venky, I'd like to book your photography services.`,
        ``,
        `Name: ${d.get('name')}`,
        `Phone: ${d.get('phone')}`,
        `Event Date: ${d.get('event-date')}`,
        `Event Type: ${d.get('event-type')}`,
        `Location: ${d.get('location')}`,
        `Message: ${d.get('message')}`
      ].join('\n');

      window.open(`https://wa.me/919676425924?text=${encodeURIComponent(msg)}`, '_blank');

      const btn = form.querySelector('.btn');
      const orig = btn.textContent;
      btn.textContent = '✓ Opening WhatsApp…';
      setTimeout(() => { btn.textContent = orig; form.reset(); }, 3000);
    });
  }
});
