import { LucideDynamicIcon, LucideSun, LucideMoon, LucideMonitor } from '@lucide/angular';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  imports: [LucideDynamicIcon],
  selector: 'app-theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
    type="button"
    class="theme-toggle"
    [disabled]="!theme.ready()"
    [attr.aria-label]="label()"
    [attr.title]="label()"
    [attr.data-theme-preference]="theme.preference()"
    (click)="theme.select(next().value)"
  >
    <svg [lucideIcon]="current().icon" [size]="19" [strokeWidth]="1.75" aria-hidden="true"></svg>
  </button>`,
  styles: `
    :host {
      display: inline-flex;
    }
    .theme-toggle {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border: 1px solid var(--border);
      border-radius: 50%;
      background: var(--surface);
      color: var(--secondary);
      transition:
        background 180ms,
        color 180ms;
    }
    .theme-toggle:hover {
      background: var(--surface-muted);
      color: var(--foreground);
    }
    .theme-toggle:disabled {
      cursor: default;
    }
  `,
})
export class ThemeSwitcherComponent {
  readonly theme = inject(ThemeService);
  readonly options = [
    { value: 'light', label: 'claro', icon: LucideSun },
    { value: 'dark', label: 'oscuro', icon: LucideMoon },
    { value: 'system', label: 'sistema', icon: LucideMonitor },
  ] as const;
  readonly index = computed(() =>
    this.options.findIndex((option) => option.value === this.theme.preference()),
  );
  readonly current = computed(() => this.options[this.index()]);
  readonly next = computed(() => this.options[(this.index() + 1) % this.options.length]);
  readonly label = computed(() => `Tema ${this.current().label}. Cambiar a ${this.next().label}`);
}
