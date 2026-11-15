(() => {
  const toggle = document.getElementById('theme-switch');
  if (toggle) {
    const reflect = () => {
      toggle.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'light'));
    };
    toggle.addEventListener('click', () => {
      const light = document.documentElement.dataset.theme !== 'light';
      if (light) document.documentElement.dataset.theme = 'light';
      else delete document.documentElement.dataset.theme;
      try { localStorage.setItem('valtern-theme', light ? 'light' : 'dark'); } catch (_) {}
      reflect();
    });
    reflect();
  }

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll('.profile-copy, .profile-links, .portfolio-project, .timeline, .interest-grid');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!motion.matches && entry.target.animate && !entry.target.matches(':target')) {
        entry.target.animate([
          { opacity: .66, transform: 'translateY(13px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 550, easing: 'cubic-bezier(.2,.65,.3,1)' });
      }
      observer.unobserve(entry.target);
    }
  }, { threshold: .08, rootMargin: '0px 0px 32px 0px' });
  elements.forEach(el => observer.observe(el));
  motion.addEventListener('change', event => { if (event.matches) observer.disconnect(); });
})();
