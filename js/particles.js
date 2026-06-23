/* ============================================
   V CREATIONS — Custom Cursor + Film Grain
   ============================================ */

class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.cursor');
    this.dot = document.querySelector('.cursor-dot');
    if (!this.cursor || !this.dot) return;
    if (window.innerWidth < 1024) return;

    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.speed = 0.15;

    this.init();
  }

  init() {
    document.addEventListener('mousemove', e => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
      this.dot.style.left = e.clientX + 'px';
      this.dot.style.top = e.clientY + 'px';
    });

    // Hover targets
    const hoverEls = document.querySelectorAll(
      'a, button, .gallery-item, .service-panel, .filter-btn, .album-arrow, .album-dot, input, textarea, select'
    );
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
    });

    this.animate();
  }

  animate() {
    this.pos.x += (this.target.x - this.pos.x) * this.speed;
    this.pos.y += (this.target.y - this.pos.y) * this.speed;
    this.cursor.style.left = this.pos.x + 'px';
    this.cursor.style.top = this.pos.y + 'px';
    requestAnimationFrame(() => this.animate());
  }
}

window.CustomCursor = CustomCursor;
