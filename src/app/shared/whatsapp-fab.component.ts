import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BackToTopComponent } from './back-to-top.component';

@Component({
  selector: 'app-whatsapp-fab',
  imports: [BackToTopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-back-to-top /><a
      class="whatsapp-fab"
      href="https://wa.me/51957049957"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir a MARRSO por WhatsApp al +51 957 049 957 (abre en una pestaña nueva)"
    >
      <span class="whatsapp-label" aria-hidden="true">Hablemos por WhatsApp</span>
      <img src="/assets/social/whatsapp.svg" width="28" height="28" alt="" aria-hidden="true" />
    </a>`,
  styles: `
    :host {
      position: fixed;
      right: max(1.25rem, env(safe-area-inset-right));
      bottom: calc(1.25rem + env(safe-area-inset-bottom));
      z-index: 35;
    }
    .whatsapp-fab {
      position: relative;
      display: grid;
      place-items: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--whatsapp);
      color: var(--whatsapp-foreground);
      box-shadow: 0 6px 16px -6px rgba(18, 140, 68, 0.45);
      transition:
        transform var(--motion-fast),
        background var(--motion-fast),
        box-shadow var(--motion-fast);
    }
    .whatsapp-fab:hover {
      background: var(--whatsapp-hover);
      transform: translateY(-2px);
      box-shadow: 0 10px 22px -8px rgba(18, 140, 68, 0.55);
    }
    .whatsapp-fab:active {
      background: #1aa34c;
      box-shadow: 0 4px 12px -6px rgba(18, 140, 68, 0.4);
      transform: none;
    }
    .whatsapp-fab:focus-visible {
      outline: 2px solid var(--whatsapp);
      outline-offset: 3px;
    }
    .whatsapp-label {
      position: absolute;
      right: calc(100% + 12px);
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-elevated);
      color: var(--foreground);
      box-shadow: var(--shadow-float);
      font-size: 0.8125rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transform: translateX(4px);
      transition:
        opacity var(--motion-fast),
        transform var(--motion-fast),
        visibility var(--motion-fast);
      pointer-events: none;
    }
    .whatsapp-fab:hover .whatsapp-label,
    .whatsapp-fab:focus-visible .whatsapp-label {
      opacity: 1;
      visibility: visible;
      transform: none;
    }
    @media (max-width: 600px) {
      :host {
        right: max(1rem, env(safe-area-inset-right));
        bottom: calc(1rem + env(safe-area-inset-bottom));
      }
    }
    @media (hover: none) {
      .whatsapp-label {
        display: none;
      }
    }
  `,
})
export class WhatsappFabComponent {}
