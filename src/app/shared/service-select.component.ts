import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideCheck, LucideChevronDown } from '@lucide/angular';

@Component({
  selector: 'app-service-select',
  imports: [ReactiveFormsModule, LucideCheck, LucideChevronDown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label id="service-label" for="service-native" class="label">Servicio de interés</label>
    <select
      id="service-native"
      [formControl]="control()"
      required
      [attr.aria-invalid]="invalid()"
      [attr.aria-describedby]="invalid() ? 'service-error' : null"
    >
      <option value="">Selecciona una opción</option>
      @for (option of options; track option) {
        <option>{{ option }}</option>
      }
    </select>
    <div class="custom">
      <button
        type="button"
        role="combobox"
        aria-labelledby="service-label service-value"
        aria-haspopup="listbox"
        aria-controls="service-options"
        aria-required="true"
        [attr.aria-expanded]="open()"
        [attr.aria-invalid]="invalid()"
        [attr.aria-describedby]="invalid() ? 'service-error' : null"
        [attr.aria-activedescendant]="open() ? 'service-option-' + active() : null"
        [class.placeholder]="!control().value"
        (click)="toggle()"
        (keydown)="onKey($event)"
        (blur)="close()"
      >
        <span id="service-value">{{ control().value || 'Selecciona una opción' }}</span>
        <svg lucideChevronDown aria-hidden="true" [class.rotated]="open()"></svg>
      </button>
      @if (open()) {
        <div id="service-options" role="listbox" aria-labelledby="service-label" class="options">
          @for (option of options; track option; let index = $index) {
            <div
              role="option"
              [id]="'service-option-' + index"
              [attr.aria-selected]="control().value === option"
              [class.active]="active() === index"
              (pointerdown)="$event.preventDefault()"
              (mouseenter)="active.set(index)"
              (click)="choose(index)"
            >
              <span>{{ option }}</span>
              @if (control().value === option) {
                <svg lucideCheck aria-hidden="true"></svg>
              }
            </div>
          }
        </div>
      }
    </div>
    @if (invalid()) {
      <small id="service-error">Selecciona un servicio.</small>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 9px;
      min-width: 0;
    }
    .label {
      color: var(--secondary);
      font-size: 0.75rem;
    }
    select,
    button {
      width: 100%;
      min-height: 46px;
      padding: 12px;
      border: 1px solid var(--input);
      border-radius: 6px;
      background: var(--background);
      color: var(--text);
      font-size: 0.875rem;
    }
    select {
      display: none;
    }
    .custom {
      position: relative;
    }
    button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      text-align: left;
      transition:
        border-color 0.18s,
        box-shadow 0.18s;
    }
    button span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    button.placeholder {
      color: var(--muted-foreground);
    }
    button:hover {
      border-color: var(--accent);
    }
    button:focus-visible,
    button[aria-expanded='true'] {
      outline: none;
      border-color: var(--ring);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 16%, transparent);
    }
    [aria-invalid='true'] {
      border-color: var(--destructive);
    }
    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--accent);
      transition: transform 0.18s;
    }
    .rotated {
      transform: rotate(180deg);
    }
    .options {
      position: absolute;
      z-index: 20;
      top: calc(100% + 8px);
      right: 0;
      width: max-content;
      min-width: 100%;
      max-width: min(340px, 80vw);
      padding: 6px;
      background: var(--surface-elevated);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: var(--shadow-panel);
    }
    [role='option'] {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 11px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      color: var(--text);
      cursor: pointer;
    }
    [role='option'].active {
      background: var(--surface-muted);
    }
    [role='option'][aria-selected='true'] {
      color: var(--accent);
      font-weight: 500;
      background: var(--accent-soft);
    }
    small {
      color: var(--destructive);
      font-size: 0.75rem;
      line-height: 1.5;
    }
    @media (max-width: 767px) {
      select {
        display: block;
        font-size: 16px;
      }
      .custom {
        display: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button,
      svg {
        transition: none;
      }
    }
  `,
})
export class ServiceSelectComponent {
  readonly control = input.required<FormControl<string>>();
  readonly invalid = input(false);
  readonly options = [
    'Ingeniería de software',
    'Inteligencia artificial',
    'Cloud & DevOps',
    'Automatización e integración',
  ];
  readonly open = signal(false);
  readonly active = signal(0);
  private readonly element = inject(ElementRef<HTMLElement>);
  private search = '';
  private lastKey = 0;

  toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.active.set(Math.max(0, this.options.indexOf(this.control().value)));
    this.open.set(true);
  }
  close(): void {
    this.open.set(false);
    this.control().markAsTouched();
  }
  choose(index: number): void {
    this.control().setValue(this.options[index]);
    this.control().markAsDirty();
    this.close();
  }
  @HostListener('document:pointerdown', ['$event'])
  outside(event: PointerEvent): void {
    if (this.open() && !this.element.nativeElement.contains(event.target as Node)) this.close();
  }
  @HostListener('window:resize')
  resize(): void {
    if (this.open()) this.close();
  }
  onKey(event: KeyboardEvent): void {
    const key = event.key;
    if (key === 'Tab') {
      this.close();
      return;
    }
    if (key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(key)) {
      event.preventDefault();
      if (!this.open()) {
        this.toggle();
        if (key === 'End') this.active.set(this.options.length - 1);
        return;
      }
      if (key === 'Enter' || key === ' ') {
        this.choose(this.active());
        return;
      }
      this.active.set(
        key === 'Home'
          ? 0
          : key === 'End'
            ? this.options.length - 1
            : (this.active() + (key === 'ArrowDown' ? 1 : -1) + this.options.length) %
              this.options.length,
      );
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      this.search = (Date.now() - this.lastKey > 700 ? '' : this.search) + key.toLocaleLowerCase();
      this.lastKey = Date.now();
      const index = this.options.findIndex((option) =>
        option.toLocaleLowerCase().startsWith(this.search),
      );
      if (!this.open()) this.toggle();
      if (index >= 0) this.active.set(index);
    }
  }
}
