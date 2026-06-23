/* ============================================
   V CREATIONS — Gallery
   Masonry filtering, lightbox, lazy-load
   ============================================ */

class Gallery {
  constructor() {
    this.grid = document.querySelector('.masonry');
    this.items = document.querySelectorAll('.gallery-item');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.lightbox = document.querySelector('.lightbox');
    this.lbImg = document.querySelector('.lightbox__img');
    this.lbClose = document.querySelector('.lightbox__close');
    this.lbPrev = document.querySelector('.lightbox__arrow--prev');
    this.lbNext = document.querySelector('.lightbox__arrow--next');
    this.lbCount = document.querySelector('.lightbox__count');

    this.filtered = [...this.items];
    this.current = 0;
    this.touchX = 0;

    if (this.grid) this.init();
  }

  init() {
    this.bindFilters();
    this.bindLightbox();
    this.bindKeys();
    this.bindTouch();
    this.lazyLoad();
  }

  /* ── Filters ── */
  bindFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.filter;
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyFilter(f);
      });
    });
  }

  applyFilter(filter) {
    this.items.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
        // Re-trigger reveal
        item.classList.remove('revealed');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.classList.add('revealed');
          });
        });
      } else {
        item.classList.add('hidden');
      }
    });
    this.filtered = [...this.items].filter(i => !i.classList.contains('hidden'));
  }

  /* ── Lightbox ── */
  bindLightbox() {
    this.items.forEach(item => {
      item.addEventListener('click', () => {
        const idx = this.filtered.indexOf(item);
        if (idx !== -1) this.open(idx);
      });
    });

    if (this.lbClose) this.lbClose.addEventListener('click', () => this.close());
    if (this.lbPrev) this.lbPrev.addEventListener('click', () => this.prev());
    if (this.lbNext) this.lbNext.addEventListener('click', () => this.next());

    if (this.lightbox) {
      this.lightbox.addEventListener('click', e => {
        if (e.target === this.lightbox) this.close();
      });
    }
  }

  bindKeys() {
    document.addEventListener('keydown', e => {
      if (!this.lightbox?.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  bindTouch() {
    if (!this.lightbox) return;
    this.lightbox.addEventListener('touchstart', e => {
      this.touchX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.lightbox.addEventListener('touchend', e => {
      const diff = this.touchX - e.changedTouches[0].screenX;
      if (diff > 50) this.next();
      else if (diff < -50) this.prev();
    }, { passive: true });
  }

  open(idx) {
    this.current = idx;
    this.updateImg();
    this.lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  prev() {
    this.current = (this.current - 1 + this.filtered.length) % this.filtered.length;
    this.updateImg();
  }

  next() {
    this.current = (this.current + 1) % this.filtered.length;
    this.updateImg();
  }

  updateImg() {
    const item = this.filtered[this.current];
    if (!item) return;
    const img = item.querySelector('img');
    if (img) {
      this.lbImg.src = img.dataset.src || img.src;
      this.lbImg.alt = img.alt;
    }
    if (this.lbCount) {
      this.lbCount.textContent = `${this.current + 1} / ${this.filtered.length}`;
    }
  }

  /* ── Lazy Loading ── */
  lazyLoad() {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.remove('img-skeleton');
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '300px 0px' });

    imgs.forEach(img => obs.observe(img));
  }
}

window.Gallery = Gallery;
