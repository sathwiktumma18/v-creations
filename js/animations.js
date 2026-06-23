/* ============================================
   V CREATIONS — Scroll Animations
   Intersection Observer reveals + counters
   ============================================ */

class ScrollReveal {
  constructor() {
    this.reveals = document.querySelectorAll(
      '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip'
    );
    this.galleryItems = document.querySelectorAll('.gallery-item.reveal');
    this.counters = document.querySelectorAll('[data-count]');
    this.animated = new Set();

    this.init();
  }

  init() {
    // General reveals
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    this.reveals.forEach(el => revealObs.observe(el));

    // Gallery image reveals (staggered)
    const galleryObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger based on position
          const delay = Array.from(this.galleryItems).indexOf(entry.target) % 5 * 120;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          galleryObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

    this.galleryItems.forEach(el => galleryObs.observe(el));

    // Counter animation
    if (this.counters.length > 0) {
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animated.has(entry.target)) {
            this.animated.add(entry.target);
            this.animateCount(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      this.counters.forEach(el => counterObs.observe(el));
    }
  }

  animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(tick);
  }
}

window.ScrollReveal = ScrollReveal;
