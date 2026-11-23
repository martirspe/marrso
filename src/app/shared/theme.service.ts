import { DOCUMENT } from '@angular/common';
import { afterNextRender, DestroyRef, inject, Injectable, signal } from '@angular/core';

export type Appearance = 'light' | 'dark' | 'system';
const normalize = (value: string | null): Appearance =>
  value === 'light' || value === 'dark' ? value : 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly preference = signal<Appearance>('system');
  readonly ready = signal(false);
  private media?: MediaQueryList;

  constructor() {
    // Keep server and first client template identical; the head bootstrap owns first paint.
    afterNextRender(() => {
      const window = this.document.defaultView;
      if (!window) return;
      this.media = window.matchMedia('(prefers-color-scheme: dark)');
      this.preference.set(normalize(this.document.documentElement.dataset['appearance'] ?? null));
      this.apply();
      this.ready.set(true);
      const systemChanged = () => this.apply();
      const storageChanged = (event: StorageEvent) => {
        if (event.key === 'marrso-appearance' || event.key === null) {
          this.preference.set(normalize(event.newValue));
          this.apply();
        }
      };
      this.media.addEventListener('change', systemChanged);
      window.addEventListener('storage', storageChanged);
      this.destroyRef.onDestroy(() => {
        this.media?.removeEventListener('change', systemChanged);
        window.removeEventListener('storage', storageChanged);
      });
    });
  }

  select(value: Appearance) {
    this.preference.set(value);
    try {
      this.document.defaultView?.localStorage.setItem('marrso-appearance', value);
    } catch {
      /* Session preference still works. */
    }
    this.apply();
  }

  private apply() {
    const dark =
      this.preference() === 'dark' || (this.preference() === 'system' && !!this.media?.matches);
    this.document.documentElement.classList.toggle('dark', dark);
    this.document.documentElement.dataset['appearance'] = this.preference();
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#0a0d0c' : '#fcfcfa');
  }
}
