document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    iconSun.style.display = isDark ? 'inline' : 'none';
    iconMoon.style.display = isDark ? 'none' : 'inline';
  }

  function updateTheme() {
    const userPref = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(userPref ? userPref === 'dark' : systemPrefersDark);
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (!localStorage.getItem('theme')) updateTheme();
  });

  updateTheme();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      updateTheme();
    });
  }

  function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      if (href === currentPath + currentHash) {
        link.classList.add('active');
      } else if (href === '/blog' && currentPath.startsWith('/blog')) {
        link.classList.add('active');
      } else if (href === '/' && currentPath === '/' && !currentHash) {
        link.classList.add('active');
      }
    });
  }

  function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollY = window.scrollY + 150;

    let activeSection = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        activeSection = id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      if (href === `/#${activeSection}` || (href === '/' && activeSection === 'home')) {
        link.classList.add('active');
      } else if (href === '/blog' && window.location.pathname.startsWith('/blog')) {
        link.classList.add('active');
      }
    });
  }

  let scrollTimeout;
  function throttledScrollHandler() {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(updateActiveNavOnScroll);
  }

  window.addEventListener('scroll', throttledScrollHandler);
  window.addEventListener('hashchange', updateActiveNavLink);
  window.addEventListener('popstate', updateActiveNavLink);
  window.addEventListener('resize', updateActiveNavOnScroll);

  updateActiveNavLink();
  updateActiveNavOnScroll();

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      setTimeout(updateActiveNavOnScroll, 100);
    });
  });
});
