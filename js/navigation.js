/* ============================================
   V CREATIONS — Navigation
   Sticky nav, mobile menu, scroll spy
   ============================================ */

class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.hamburger = document.querySelector('.hamburger');
    this.links = document.querySelector('.nav__links');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('section[id]');
    this.isOpen = false;

    this.init();
  }

  init() {
    // Scroll listener
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();

    // Hamburger
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggle());
    }

    // Nav link clicks — smooth scroll
    this.navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
          const offset = this.nav ? this.nav.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        if (this.isOpen) this.toggle();
      });
    });

    // Scroll spy
    this.setupScrollSpy();

    // ESC to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.toggle();
    });
  }

  onScroll() {
    if (window.scrollY > 60) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.hamburger.classList.toggle('open');
    this.links.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  }

  setupScrollSpy() {
    if (!this.sections.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.25, rootMargin: '-15% 0px -50% 0px' });

    this.sections.forEach(sec => obs.observe(sec));
  }
}

window.Navigation = Navigation;
