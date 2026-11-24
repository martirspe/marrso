import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Request } from 'express';
import { hasAdvertisingConsent, sendMetaEvent } from './meta-conversions';

const request = (advertising: boolean): Request =>
  ({
    headers: {
      cookie: `marrso-cookie-consent=${encodeURIComponent(JSON.stringify({ analytics: false, advertising }))}; _fbp=fb.1.123.456`,
    },
    ip: '203.0.113.5',
    get: (name: string) => (name === 'user-agent' ? 'Test browser' : undefined),
  }) as unknown as Request;

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env['META_PIXEL_ID'];
  delete process.env['META_CAPI_ACCESS_TOKEN'];
});

describe('Meta Conversions API', () => {
  it('no comparte eventos sin consentimiento publicitario', async () => {
    process.env['META_PIXEL_ID'] = '123456';
    process.env['META_CAPI_ACCESS_TOKEN'] = 'private-token';
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(hasAdvertisingConsent(request(false))).toBe(false);
    await sendMetaEvent(request(false), 'Lead', 'event-1', '/contacto', 'person@example.com');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('envía Lead con email hasheado y el identificador de deduplicación', async () => {
    process.env['META_PIXEL_ID'] = '123456';
    process.env['META_CAPI_ACCESS_TOKEN'] = 'private-token';
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetch);
    await sendMetaEvent(request(true), 'Lead', 'event-1', '/contacto', 'Person@Example.com');
    const [url, options] = fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(url).toBe('https://graph.facebook.com/v25.0/123456/events');
    expect(body.data[0]).toMatchObject({
      event_name: 'Lead',
      event_id: 'event-1',
      action_source: 'website',
    });
    expect(body.data[0].user_data.em).toMatch(/^[a-f0-9]{64}$/);
    expect(body.data[0].user_data.em).not.toContain('Person@Example.com');
    expect(options.headers.Authorization).toBe('Bearer private-token');
  });
});
