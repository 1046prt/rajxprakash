class ScrollToTop {
  constructor() {
    this.button = document.getElementById('scrollToTopBtn');
    this.footer = document.querySelector('.footer');
    this.init();
  }

  init() {
    if (!this.button) return;

    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });

    window.addEventListener('scroll', () => {
      this.toggleVisibility();
      this.adjustForFooter();
    });

    this.toggleVisibility();
    this.adjustForFooter();
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  toggleVisibility() {
    if (!this.button) return;

    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 300) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }

  adjustForFooter() {
    if (!this.button || !this.footer) return;

    const footerRect = this.footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (footerRect.top < windowHeight && footerRect.bottom > 0) {
      this.button.classList.add('above-footer');
    } else {
      this.button.classList.remove('above-footer');
    }
  }
}

function initScrollToTop() {
  new ScrollToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollToTop);
} else if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initScrollToTop();
} else {
  window.addEventListener('load', initScrollToTop);
}
