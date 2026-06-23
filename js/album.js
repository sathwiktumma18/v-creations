/* ============================================
   V CREATIONS — Album Carousel
   Auto-rotating spread carousel with dots
   ============================================ */

class AlbumCarousel {
  constructor() {
    this.wrap = document.querySelector('.album-book');
    if (!this.wrap) return;

    this.viewport = this.wrap.querySelector('.album-book__viewport');
    this.slides = this.wrap.querySelectorAll('.album-book__page');
    this.dots = this.wrap.querySelectorAll('.album-dot');
    this.prevBtn = this.wrap.querySelector('.album-arrow:first-of-type');
    this.nextBtn = this.wrap.querySelector('.album-arrow:last-of-type');

    this.current = 0;
    this.total = this.slides.length;
    this.timer = null;
    this.delay = 5000;
    this.hovering = false;

    this.init();
  }

  init() {
    this.show(0);
    this.bindEvents();
    this.startAuto();
  }

  bindEvents() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.prev(); this.resetAuto(); });
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.next(); this.resetAuto(); });

    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { this.show(i); this.resetAuto(); });
    });

    this.wrap.addEventListener('mouseenter', () => { this.hovering = true; this.stopAuto(); });
    this.wrap.addEventListener('mouseleave', () => { this.hovering = false; this.startAuto(); });

    // Touch
    let startX = 0;
    this.viewport.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
    this.viewport.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].screenX;
      if (diff > 50) this.next();
      else if (diff < -50) this.prev();
      this.resetAuto();
    }, { passive: true });
  }

  show(idx) {
    this.current = idx;
    this.slides.forEach((slide, i) => {
      if (i === idx) {
        slide.style.display = 'block';
        slide.style.opacity = '1';
        slide.style.transform = 'rotateY(0deg)';
      } else {
        slide.style.opacity = '0';
        slide.style.transform = 'rotateY(-15deg)';
        setTimeout(() => {
          if (i !== this.current) slide.style.display = 'none';
        }, 600);
      }
    });
    this.dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  prev() { this.show((this.current - 1 + this.total) % this.total); }
  next() { this.show((this.current + 1) % this.total); }

  startAuto() {
    if (this.timer || this.hovering) return;
    this.timer = setInterval(() => this.next(), this.delay);
  }

  stopAuto() {
    clearInterval(this.timer);
    this.timer = null;
  }

  resetAuto() {
    this.stopAuto();
    if (!this.hovering) this.startAuto();
  }
}

window.AlbumCarousel = AlbumCarousel;
