import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from './cookie-consent.service';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (consent.preferences() === null || consent.open()) {
      <section class="cookie-panel" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-description">
        <div class="cookie-content">
          <div>
            <p class="cookie-eyebrow">TU PRIVACIDAD</p>
            <h2 id="cookie-title">Cookies y medición</h2>
            <p id="cookie-description">Usamos almacenamiento necesario para recordar tus preferencias. Con tu permiso, podemos usar analítica para comprender el uso del sitio y píxeles publicitarios para medir campañas. Las herramientas solo se cargan si están configuradas y autorizadas. <a routerLink="/privacidad" fragment="cookies">Más en Privacidad</a>.</p>
          </div>
          @if (configuring()) {
            <div class="cookie-settings">
              <div class="cookie-category"><span><strong>Necesarias</strong><small>Guardan tus preferencias y permiten el funcionamiento del sitio.</small></span><span class="cookie-required">Siempre activas</span></div>
              <label class="cookie-category"><span><strong>Analítica</strong><small>Google Analytics 4 permite conocer las páginas visitadas y el uso del sitio.</small></span><input type="checkbox" role="switch" [checked]="analytics()" (change)="analytics.set($any($event.target).checked)" /></label>
              <label class="cookie-category"><span><strong>Publicidad</strong><small>Meta Pixel y TikTok Pixel permiten medir visitas vinculadas a campañas.</small></span><input type="checkbox" role="switch" [checked]="advertising()" (change)="advertising.set($any($event.target).checked)" /></label>
            </div>
          }
          <div class="cookie-actions">
            <button type="button" class="cookie-secondary" (click)="saveNecessary()">Solo necesarias</button>
            @if (configuring()) {
              <button type="button" class="cookie-secondary" (click)="configuring.set(false)">Volver</button>
              <button type="button" class="cookie-primary" (click)="save()">Guardar preferencias</button>
            } @else {
              <button type="button" class="cookie-secondary" (click)="configure()">Configurar</button>
              <button type="button" class="cookie-primary" (click)="consent.save({ analytics: true, advertising: true })">Aceptar todas</button>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .cookie-panel { position: fixed; z-index: 100; bottom: 1rem; left: 1rem; width: min(32rem, calc(100vw - 2rem)); max-height: calc(100dvh - 2rem); overflow-y: auto; border: 1px solid var(--border); border-radius: 1.25rem; background: var(--surface-elevated); box-shadow: var(--shadow-float); color: var(--foreground); }
    .cookie-content { padding: clamp(1.25rem, 3vw, 1.75rem); }
    .cookie-eyebrow { color: var(--accent); font-size: .7rem; font-weight: 700; letter-spacing: .12em; }
    h2 { margin: .3rem 0 .6rem; font-size: 1.35rem; font-weight: 650; }
    p { margin: 0; }
    #cookie-description { color: var(--muted-foreground); font-size: .875rem; line-height: 1.6; }
    a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
    .cookie-settings { margin-top: 1rem; }
    .cookie-category { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 4.25rem; padding: .75rem 0; border-top: 1px solid var(--border); }
    .cookie-category span:first-child { display: grid; gap: .2rem; }
    .cookie-category strong { font-size: .875rem; }
    .cookie-category small { color: var(--muted-foreground); font-size: .78rem; line-height: 1.4; }
    .cookie-required { flex-shrink: 0; color: var(--muted-foreground); font-size: .7rem; }
    input[role=switch] { appearance: none; position: relative; flex: 0 0 auto; width: 2.75rem; height: 1.5rem; border-radius: 1rem; background: var(--surface-muted); border: 1px solid var(--border); cursor: pointer; }
    input[role=switch]::after { content: ''; position: absolute; top: .12rem; left: .12rem; width: 1.15rem; height: 1.15rem; border-radius: 50%; background: var(--foreground); transition: transform 160ms ease; }
    input[role=switch]:checked { background: var(--accent); border-color: var(--accent); }
    input[role=switch]:checked::after { background: var(--background); transform: translateX(1.2rem); }
    .cookie-actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.25rem; }
    button { min-height: 44px; padding: .6rem .85rem; border-radius: .7rem; font-size: .8rem; font-weight: 650; cursor: pointer; }
    button:focus-visible, input:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
    .cookie-secondary { border: 1px solid var(--border); background: var(--surface); color: var(--foreground); }
    .cookie-primary { border: 1px solid var(--primary); background: var(--primary); color: var(--primary-foreground); }
    @media (max-width: 480px) { .cookie-panel { bottom: .5rem; left: .5rem; width: calc(100vw - 1rem); } .cookie-actions button { flex: 1 1 45%; } .cookie-actions .cookie-primary { flex-basis: 100%; } }
    @media (prefers-reduced-motion: reduce) { input[role=switch]::after { transition: none; } }
  `,
})
export class CookieConsentComponent {
  readonly consent = inject(CookieConsentService);
  readonly configuring = signal(false);
  readonly analytics = signal(false);
  readonly advertising = signal(false);
  configure(): void {
    this.analytics.set(this.consent.preferences()?.analytics ?? false);
    this.advertising.set(this.consent.preferences()?.advertising ?? false);
    this.configuring.set(true);
  }
  saveNecessary(): void { this.consent.save({ analytics: false, advertising: false }); this.configuring.set(false); }
  save(): void { this.consent.save({ analytics: this.analytics(), advertising: this.advertising() }); this.configuring.set(false); }
}
