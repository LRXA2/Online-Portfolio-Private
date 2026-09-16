let frame = 0;
let finish: (() => void) | undefined;
export function cancelSectionScroll() {
  cancelAnimationFrame(frame);
  frame = 0;
  finish = undefined;
}


/** Animate section anchors explicitly; native smooth scrolling may be disabled by the browser. */
export function initSectionScrolling() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('.section-nav a, [data-section-link]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    cancelSectionScroll();
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
      cancelSectionScroll();
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

  window.addEventListener('wheel', cancelSectionScroll, { passive: true });
  window.addEventListener('touchstart', cancelSectionScroll, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(event.key)) cancelSectionScroll();
  });
  window.addEventListener('popstate', cancelSectionScroll);
  window.addEventListener('resize', cancelSectionScroll);
  window.addEventListener('pagehide', cancelSectionScroll);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish?.(); });
}
