import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideSparkles, LucideBookOpen } from '@lucide/angular';
import { PRODUCTS, UPCOMING } from './product-catalog';
import { CookieConsentService } from './cookie-consent.service';
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, LucideSparkles, LucideBookOpen],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
})
export class SiteFooterComponent {
  readonly cookieConsent = inject(CookieConsentService);
  moveWordmark(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    const target = event.currentTarget as HTMLElement;
    const bounds = target.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    target.style.setProperty(
      '--wordmark-x',
      ((event.clientX - bounds.left) / bounds.width) * 100 + '%',
    );
    target.style.setProperty(
      '--wordmark-y',
      ((event.clientY - bounds.top) / bounds.height) * 100 + '%',
    );
  }
  resetWordmark(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.style.removeProperty('--wordmark-x');
    target.style.removeProperty('--wordmark-y');
  }
  readonly year = new Date().getFullYear();
  readonly products = PRODUCTS;
  readonly upcoming = UPCOMING;
}
