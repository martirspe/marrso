import { HeaderHazeComponent } from './header-haze.component';
import { SiteFooterComponent } from './site-footer.component';
import { PRODUCTS, UPCOMING } from './product-catalog';
import {
  LucideChevronDown,
  LucideX,
  LucideMenu,
  LucideSparkles,
  LucideDynamicIcon,
} from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { WhatsappFabComponent } from './whatsapp-fab.component';
@Component({
  selector: 'app-site-shell',
  host: {
    '(document:keydown.escape)': 'dismissMenus()',
    '(document:click)': 'onOutsideInteraction($event)',
    '(document:focusin)': 'onOutsideInteraction($event)',
    '(window:resize)': 'onResize()',
    '(window:scroll)': 'onScroll()',
  },
  imports: [
    LucideChevronDown,
    LucideX,
    LucideMenu,
    LucideDynamicIcon,
    LucideSparkles,
    RouterLink,
    RouterLinkActive,
    ThemeSwitcherComponent,
    WhatsappFabComponent,
    SiteFooterComponent,
    HeaderHazeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-shell.component.html',
  styleUrl: './site-shell.component.css',
})
export class SiteShellComponent {
  private readonly router = inject(Router);
  readonly headerElement = viewChild<ElementRef<HTMLElement>>('headerElement');
  readonly ecosystemButton = viewChild<ElementRef<HTMLButtonElement>>('ecosystemButton');
  readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  readonly open = signal(false);
  readonly ecosystemOpen = signal(false);
  readonly scrolled = signal(false);
  readonly ecosystemActive = signal(this.router.url.startsWith('/ecosistema'));
  readonly products = PRODUCTS;
  readonly upcoming = UPCOMING;
  readonly selectedProduct = signal(this.products[0]);
  constructor() {
    afterNextRender(() => this.onScroll());
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.open.set(false);
        this.ecosystemOpen.set(false);
        this.ecosystemActive.set(event.urlAfterRedirects.startsWith('/ecosistema'));
      }
    });
  }
  onScroll() {
    this.scrolled.set(window.scrollY > 32);
  }
  dismissMenus() {
    if (this.ecosystemOpen()) {
      this.ecosystemOpen.set(false);
      this.ecosystemButton()?.nativeElement.focus();
    } else if (this.open()) {
      this.open.set(false);
      this.menuButton()?.nativeElement.focus();
    }
  }
  onOutsideInteraction(event: Event) {
    if (!this.headerElement()?.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
      this.ecosystemOpen.set(false);
    }
  }
  onEcosystemFocusOut(event: FocusEvent) {
    if (
      event.relatedTarget &&
      !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)
    )
      this.ecosystemOpen.set(false);
  }
  onResize() {
    this.open.set(false);
    this.ecosystemOpen.set(false);
  }
}
