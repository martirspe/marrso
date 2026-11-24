import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  signal,
  afterRenderEffect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  template:
    '<a class="skip-link" href="#contenido">Saltar al contenido principal</a><router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly navigation = signal<NavigationEnd | null>(null);
  constructor() {
    let initial = true;
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      if (initial) {
        initial = false;
        return;
      }
      this.navigation.set(event);
    });
    afterRenderEffect(() => {
      const event = this.navigation();
      if (!event) return;
      const fragment = this.router.parseUrl(event.urlAfterRedirects).fragment;
      const target =
        (fragment ? this.document.getElementById(fragment) : null) ??
        this.document.querySelector('main');
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
    });
  }
}
