(() => {
  const shell = document.getElementById('edge-navigation');
  const panel = document.getElementById('edge-menu');
  const toggle = document.getElementById('edge-toggle');
  const sensor = document.getElementById('edge-sensor');
  if (!shell || !panel || !toggle || !sensor) return;
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let opened = false, pinned = false;
  let closeTimer = 0;
  function keepOpen() {
    clearTimeout(closeTimer);
    closeTimer = 0;
  }
  function closeLater() {
    if (closeTimer || pinned) return;
    closeTimer = setTimeout(() => {
      closeTimer = 0;
      if (!pinned && !shell.contains(document.activeElement)) show(false);
    }, 107);
  }
  function show(value) {
    keepOpen();
    opened = value;
    shell.classList.toggle('is-open', value);
    toggle.setAttribute('aria-expanded', String(value));
    panel.inert = !value;
    panel.setAttribute('aria-hidden', String(!value));
  }
  function enterEdge() {
    if (!hover.matches) return;
    keepOpen();
    if (!opened) show(true);
  }
  sensor.addEventListener('pointerenter', enterEdge);
  shell.addEventListener('pointerenter', enterEdge);
  toggle.addEventListener('pointerenter', enterEdge);
  panel.addEventListener('pointerenter', enterEdge);
  shell.addEventListener('pointerleave', () => {
    if (hover.matches) closeLater();
  });
  // Зона перехода доступна сразу, даже пока панель ещё выезжает.
  document.addEventListener('pointermove', event => {
    if (!hover.matches) return;
    if (event.clientX <= 20) enterEdge();
    if (!opened) return;
    const width = shell.getBoundingClientRect().width;
    if (event.clientX <= width + 12) keepOpen();
    else closeLater();
  }, { passive: true });
  toggle.addEventListener('click', () => { pinned = !pinned; show(pinned); });
  toggle.addEventListener('focus', () => { if (toggle.matches(':focus-visible')) show(true); });
  shell.addEventListener('focusout', () => {
    setTimeout(() => {
      if (!shell.contains(document.activeElement) && !shell.matches(':hover')) { pinned = false; show(false); }
    }, 0);
  });
  document.addEventListener('pointerdown', event => {
    if (!shell.contains(event.target)) { pinned = false; show(false); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && opened) {
      pinned = false;
      if (shell.contains(document.activeElement)) toggle.focus();
      show(false);
    }
  });
  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    pinned = false;
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    show(false);
  }));
  const links = [...panel.querySelectorAll('a:not(.edge-top)')];
  const targets = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function current() {
    scheduled = false;
    let active = -1;
    targets.forEach((target, i) => {
      if (target && target.getBoundingClientRect().top <= innerHeight * .35) active = i;
    });
    links.forEach((link, i) => {
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(current); }
  }, { passive: true });
  addEventListener('resize', current);
  show(false);
  current();
})();
