import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CookieConsentService } from './cookie-consent.service';

declare global {
  interface Window {
    MARRSO_TRACKING?: { ga4?: string; meta?: string; tiktok?: string };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: Record<string, unknown> & { page?: () => void; load?: (id: string) => void; track?: (event: string) => void };
  }
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private readonly consent = inject(CookieConsentService);
  private readonly router = inject(Router);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private gaLoaded = false;
  private metaLoaded = false;
  private tiktokLoaded = false;
  private lastPage = '';
  private previousAdvertising = false;

  constructor() {
    if (!this.browser) return;
    effect(() => {
      const preference = this.consent.preferences();
      if (!preference) return;
      const config = window.MARRSO_TRACKING ?? {};
      if (config.ga4 && /^G-[A-Z0-9]+$/.test(config.ga4)) this.google(config.ga4, preference.analytics);
      if (preference.advertising) {
        if (config.meta && /^\d+$/.test(config.meta)) this.meta(config.meta);
        if (config.tiktok && /^[A-Z0-9]+$/i.test(config.tiktok)) this.tiktok(config.tiktok);
      } else if (this.previousAdvertising && (this.metaLoaded || this.tiktokLoaded)) {
        // Pixel SDKs do not offer a reliable unload operation. Reload with denied consent.
        window.location.reload();
      }
      this.previousAdvertising = preference.advertising;
      if (preference.analytics || preference.advertising) this.pageView();
    });
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => this.pageView());
  }

  private script(src: string): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  private google(id: string, allowed: boolean): void {
    if (!this.gaLoaded && !allowed) return;
    if (!this.gaLoaded) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
      window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('js', new Date());
      window.gtag('config', id, { send_page_view: false });
      this.script(`https://www.googletagmanager.com/gtag/js?id=${id}`);
      this.gaLoaded = true;
    }
    window.gtag?.('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  }

  private meta(id: string): void {
    if (this.metaLoaded) return;
    const queue: unknown[][] = [];
    window.fbq = (...args: unknown[]) => { queue.push(args); };
    Object.assign(window.fbq, { queue, loaded: true, version: '2.0' });
    this.script('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', id);
    this.metaLoaded = true;
  }

  private tiktok(id: string): void {
    if (this.tiktokLoaded) return;
    const queue: unknown[][] = [];
    const ttq: Record<string, unknown> = { _i: { [id]: Object.assign([], { _u: 'https://analytics.tiktok.com/i18n/pixel/events.js' }) }, _t: { [id]: Date.now() }, _o: { [id]: {} } };
    for (const method of ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie']) {
      ttq[method] = (...args: unknown[]) => { queue.push([method, ...args]); };
    }
    Object.assign(queue, ttq);
    window.ttq = queue as unknown as typeof window.ttq;
    this.script('https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + encodeURIComponent(id) + '&lib=ttq');
    this.tiktokLoaded = true;
  }

  private pageView(): void {
    const preference = this.consent.preferences();
    if (!preference) return;
    const page = this.router.url.split('#')[0];
    const key = `${page}:${preference.analytics && this.gaLoaded}:${preference.advertising && this.metaLoaded}:${preference.advertising && this.tiktokLoaded}`;
    if (key === this.lastPage) return;
    this.lastPage = key;
    if (preference.analytics && this.gaLoaded) window.gtag?.('event', 'page_view', { page_path: page, page_location: location.origin + page });
    if (preference.advertising && this.metaLoaded) window.fbq?.('track', 'PageView');
    if (preference.advertising && this.tiktokLoaded) window.ttq?.page?.();
  }
}
