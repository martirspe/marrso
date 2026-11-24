import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export interface CookiePreferences {
  analytics: boolean;
  advertising: boolean;
}

const KEY = 'marrso-cookie-consent';
const MAX_AGE = 60 * 60 * 24 * 180;

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly preferences = signal<CookiePreferences | null>(null);
  readonly open = signal(false);

  constructor() {
    if (!this.browser) return;
    let raw: string | null = null;
    try {
      const cookie = document.cookie.split('; ').find((part) => part.startsWith(`${KEY}=`));
      raw = cookie ? decodeURIComponent(cookie.slice(KEY.length + 1)) : null;
    } catch { /* Cookies may be disabled. */ }
    if (!raw) {
      try { raw = localStorage.getItem(KEY); } catch { /* Storage may be disabled. */ }
    }
    try {
      const value: unknown = JSON.parse(raw ?? 'null');
      if (value && typeof value === 'object' && 'analytics' in value && 'advertising' in value &&
          typeof value.analytics === 'boolean' && typeof value.advertising === 'boolean') {
        this.preferences.set({ analytics: value.analytics, advertising: value.advertising });
      }
    } catch { /* Invalid saved preference: ask again. */ }
  }

  show(): void { this.open.set(true); }

  save(value: CookiePreferences): void {
    const preferences = { analytics: Boolean(value.analytics), advertising: Boolean(value.advertising) };
    this.preferences.set(preferences);
    this.open.set(false);
    if (!this.browser) return;
    const serialized = JSON.stringify(preferences);
    try { localStorage.setItem(KEY, serialized); } catch { /* Storage may be disabled. */ }
    try {
      document.cookie = `${KEY}=${encodeURIComponent(serialized)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch { /* Cookies may be disabled. */ }
  }
}
