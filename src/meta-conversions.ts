import { createHash } from 'node:crypto';
import type { Request } from 'express';

const CONSENT_COOKIE = 'marrso-cookie-consent';

export function hasAdvertisingConsent(req: Request): boolean {
  const value = req.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  if (!value) return false;
  try {
    return (
      JSON.parse(decodeURIComponent(value.slice(CONSENT_COOKIE.length + 1))).advertising === true
    );
  } catch {
    return false;
  }
}

export function metaConfigured(): boolean {
  return (
    /^\d+$/.test(process.env['META_PIXEL_ID'] ?? '') &&
    Boolean(process.env['META_CAPI_ACCESS_TOKEN'])
  );
}

export async function sendMetaEvent(
  req: Request,
  eventName: 'Lead' | 'PageView',
  eventId: string,
  path: string,
  email?: string,
): Promise<void> {
  const pixelId = process.env['META_PIXEL_ID'];
  const token = process.env['META_CAPI_ACCESS_TOKEN'];
  if (!pixelId || !token || !metaConfigured() || !hasAdvertisingConsent(req)) return;

  const userData: Record<string, string> = {
    client_user_agent: req.get('user-agent') ?? '',
  };
  if (email) userData['em'] = createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
  if (req.ip) userData['client_ip_address'] = req.ip;
  for (const key of ['_fbp', '_fbc'] as const) {
    const cookie = req.headers.cookie
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${key}=`));
    if (cookie) {
      try {
        userData[key.slice(1)] = decodeURIComponent(cookie.slice(key.length + 1));
      } catch {
        /* Ignore malformed cookie. */
      }
    }
  }
  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: `https://marrso.com${path}`,
        user_data: userData,
      },
    ],
    ...(process.env['META_CAPI_TEST_EVENT_CODE']
      ? { test_event_code: process.env['META_CAPI_TEST_EVENT_CODE'] }
      : {}),
  };
  const response = await fetch(`https://graph.facebook.com/v25.0/${pixelId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Meta Conversions API returned ${response.status}`);
}
