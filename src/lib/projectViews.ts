import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

type View = 'category' | 'year';

export function initProjectViews() {
  const controls = document.querySelector<HTMLElement>('.project-view');
  const main = document.querySelector<HTMLElement>('#project-groups');
  const nav = document.querySelector<HTMLElement>('.proj-shell .section-nav');
  if (!controls || !main || !nav) return;

  const rows = Array.from(main.querySelectorAll<HTMLElement>('.proj-row'));
  const groups = Array.from(main.querySelectorAll<HTMLElement>('[data-project-group]'));
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
  const buttons = Array.from(controls.querySelectorAll<HTMLButtonElement>('[data-project-view]'));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let view: View = 'category';
  let transition: gsap.core.Timeline | undefined;

  function switchView(next: View, animate = true) {
    if (next === view) return;
    transition?.progress(1).kill();
    const motion = animate && !reduce.matches;
    const state = motion ? Flip.getState(rows) : undefined;
    view = next;
    controls!.dataset.view = next;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.projectView === next)));

    // Move the original nodes so dossier listeners, IDs, and focus targets survive.
    groups.forEach(group => {
      group.hidden = group.dataset.projectGroup !== next;
      if (group.hidden) return;
      const list = group.querySelector('ol')!;
      const members = rows.filter(row => next === 'year'
        ? `year-${row.dataset.startYear}` === group.id
        : row.dataset.category === group.id);
      members.forEach((row, index) => {
        list.append(row);
        row.querySelector('.row-num')!.textContent = String(index + 1).padStart(2, '0');
      });
    });
    links.forEach(link => {
      link.hidden = document.getElementById(link.hash.slice(1))!.hidden;
      if (link.hidden) link.removeAttribute('aria-current');
    });
    nav!.scrollLeft = 0;
    nav!.dispatchEvent(new Event('section-nav:refresh'));

    if (state) {
      transition = Flip.from(state, { duration: .5, ease: 'power2.inOut', prune: true });
      transition.fromTo(links.filter(link => !link.hidden),
        { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .3, clearProps: 'opacity,transform' }, 0);
      transition.fromTo(groups.filter(group => !group.hidden).map(group => group.querySelector('.section-head')),
        { opacity: 0 }, { opacity: 1, duration: .35, clearProps: 'opacity' }, .1);
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    switchView(button.dataset.projectView as View);
  }));
  reduce.addEventListener('change', () => { if (reduce.matches) transition?.progress(1).kill(); });

  // Direct section links reveal the corresponding view; project anchors stay stable.
  function revealHashGroup() {
    const group = groups.find(group => `#${group.id}` === location.hash);
    if (group?.hidden) {
      switchView(group.dataset.projectGroup as View, false);
      group.scrollIntoView({ behavior: 'instant' });
    }
  }
  window.addEventListener('hashchange', revealHashGroup);
  controls.hidden = false;
  revealHashGroup();
}
