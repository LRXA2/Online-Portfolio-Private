/** Animate section anchors explicitly; native smooth scrolling may be disabled by the browser. */
export function initSectionScrolling() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let finish: (() => void) | undefined;
  function cancel() {
    cancelAnimationFrame(frame);
    frame = 0;
    finish = undefined;
  }

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-project-view]')) cancel();
    const link = event.target.closest<HTMLAnchorElement>('.section-nav a, .project-bookmarks a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    cancel();
    const start = scrollY;
    const end = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight,
      target.getBoundingClientRect().top + start - parseFloat(getComputedStyle(target).scrollMarginTop || '0')));
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);

    finish = () => {
      scrollTo({ top: end, behavior: 'instant' });
      const previousTabIndex = target.getAttribute('tabindex');
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      if (previousTabIndex === null) target.removeAttribute('tabindex');
      else target.setAttribute('tabindex', previousTabIndex);
      cancel();
    };
    if (reducedMotion.matches || Math.abs(end - start) < 1) { finish(); return; }
    const started = performance.now();
    function tick(now: number) {
      const progress = Math.min(1, (now - started) / 550);
      const eased = 1 - Math.pow(1 - progress, 3);
      scrollTo({ top: start + (end - start) * eased, behavior: 'instant' });
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish?.();
    }
    frame = requestAnimationFrame(tick);
  });

  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(event.key)) cancel();
  });
  window.addEventListener('popstate', cancel);
  window.addEventListener('resize', cancel);
  window.addEventListener('pagehide', cancel);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish?.(); });
}
