import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { LucideArrowUp } from '@lucide/angular';

@Component({
  selector: 'app-back-to-top',
  imports: [LucideArrowUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
    type="button"
    class="back-top"
    [class.is-visible]="visible()"
    [attr.tabindex]="visible() ? 0 : -1"
    [attr.aria-hidden]="visible() ? null : 'true'"
    aria-label="Volver arriba"
    title="Volver arriba"
    (click)="goToTop()"
  >
    <svg lucideArrowUp [size]="18" [strokeWidth]="2" aria-hidden="true"></svg>
  </button>`,
  styles: `
    :host {
      position: absolute;
      bottom: calc(100% + 12px);
      left: 6px;
      width: 44px;
      height: 44px;
    }
    .back-top {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 50%;
      background: var(--surface-elevated);
      color: var(--secondary);
      box-shadow: var(--shadow-float);
      opacity: 0;
      visibility: hidden;
      transform: translateY(6px);
      pointer-events: none;
      transition:
        opacity var(--motion-normal),
        visibility var(--motion-normal),
        transform var(--motion-normal),
        color var(--motion-fast),
        background var(--motion-fast),
        border-color var(--motion-fast);
    }
    .back-top.is-visible {
      opacity: 1;
      visibility: visible;
      transform: none;
      pointer-events: auto;
    }
    .back-top:hover {
      color: var(--accent);
      border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
      background: var(--accent-soft);
    }
    .back-top:active {
      transform: translateY(1px);
    }
    @media (prefers-reduced-motion: reduce) {
      .back-top,
      .back-top:active {
        transform: none;
      }
    }
  `,
})
export class BackToTopComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      const window = this.document.defaultView;
      if (!window) return;
      const update = () => {
        const hero = this.document.querySelector('.hero');
        this.visible.set(
          hero
            ? hero.getBoundingClientRect().bottom < 80
            : window.scrollY > window.innerHeight * 0.7,
        );
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      });
    });
  }

  goToTop() {
    const window = this.document.defaultView;
    if (!window) return;
    const main = this.document.querySelector<HTMLElement>('main');
    // Move keyboard focus back into the page before this control becomes hidden.
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    }
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
}
