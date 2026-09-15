import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Optional visual enhancement; the dialog owns its lifetime and scroll position. */
export function animateDossier(dialog: HTMLDialogElement): () => void {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    dialog.querySelectorAll<HTMLAnchorElement>('.dossier-gallery--wide a').forEach(frame => {
      gsap.fromTo(frame, { scale: 0.97 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          scroller: dialog,
          start: 'top bottom',
          end: 'top 45%',
          scrub: true,
        },
      });
    });
    ScrollTrigger.refresh();
  });
  return () => media.revert();
}
