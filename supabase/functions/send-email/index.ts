import { Resend } from 'resend';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  inspectionType?: unknown;
  vehicle?: unknown;
  vehicleLocation?: unknown;
  preferredTime?: unknown;
  listingUrl?: unknown;
  message?: unknown;
  website?: unknown;
  pageUrl?: unknown;
  language?: unknown;
};

type RateLimitResult = {
  allowed: boolean;
  scope: string | null;
  retry_after_seconds: number;
};

const allowedOrigins = new Set([
  'https://checkauto.lt',
  'https://www.checkauto.lt',
]);

const inspectionTypes: Record<string, string> = {
  full_inspection: 'Išsami patikra prieš pirkimą',
  computer_diagnostics: 'Kompiuterinė diagnostika',
};

const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? '';
const senderEmail = Deno.env.get('CONTACT_FROM_EMAIL') ?? 'mail@noreply.checkauto.lt';
const recipientEmail = Deno.env.get('CONTACT_TO_EMAIL') ?? 'info@checkauto.lt';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAdminKey = getSupabaseAdminKey();
const rateLimitHashSecret = Deno.env.get('RATE_LIMIT_HASH_SECRET') ?? supabaseAdminKey;

function getSupabaseAdminKey() {
  const legacyServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (legacyServiceRoleKey) return legacyServiceRoleKey;

  try {
    const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}');
    return typeof secretKeys.default === 'string' ? secretKeys.default : '';
  } catch {
    return '';
  }
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin');
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : 'https://checkauto.lt';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function jsonResponse(
  req: Request,
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { ...getCorsHeaders(req), ...extraHeaders },
  });
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function cleanMessage(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, maxLength);
}

function normalizeUrl(value: unknown) {
  const raw = cleanText(value, 500);
  if (!raw) return '';

  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.toString();
  } catch {
    return '';
  }
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

function formatMultiline(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function getClientIp(req: Request) {
  const cloudflareIp = cleanText(req.headers.get('cf-connecting-ip'), 100);
  if (cloudflareIp) return cloudflareIp;

  const forwardedFor = cleanText(req.headers.get('x-forwarded-for'), 300);
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIp = cleanText(req.headers.get('x-real-ip'), 100);
  return realIp || 'unknown';
}

function normalizePhoneForRateLimit(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits || phone.toLowerCase();
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getSupabaseHeaders() {
  const headers: Record<string, string> = {
    apikey: supabaseAdminKey,
    'Content-Type': 'application/json',
  };

  if (!supabaseAdminKey.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${supabaseAdminKey}`;
  }

  return headers;
}

async function hashIdentifier(scope: string, value: string) {
  return sha256Hex(`${rateLimitHashSecret}:${scope}:${value}`);
}

async function checkRateLimit(req: Request, email: string, phone: string) {
  if (!supabaseUrl || !supabaseAdminKey || !rateLimitHashSecret) {
    throw new Error('Missing Supabase rate limit configuration.');
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/check_contact_rate_limit`;
  const clientIp = getClientIp(req);
  const [ipHash, emailHash, phoneHash] = await Promise.all([
    hashIdentifier('ip', clientIp),
    hashIdentifier('email', email),
    hashIdentifier('phone', normalizePhoneForRateLimit(phone)),
  ]);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getSupabaseHeaders(),
    body: JSON.stringify({
      p_ip_hash: ipHash,
      p_email_hash: emailHash,
      p_phone_hash: phoneHash,
    }),
  });

  if (!response.ok) {
    throw new Error(`Rate limit check failed with status ${response.status}.`);
  }

  const result = await response.json() as RateLimitResult;
  const retryAfterSeconds = Number(result.retry_after_seconds) || 60;

  return {
    allowed: result.allowed === true,
    scope: result.scope,
    retryAfterSeconds,
  };
}

function detailRow(label: string, value: string) {
  const displayValue = value || 'Nepateikta';

  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e8e8ed;color:#6e6e73;font-size:14px;vertical-align:top;width:220px;">${escapeHtml(label)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e8e8ed;color:#1d1d1f;font-size:15px;font-weight:600;vertical-align:top;">${displayValue}</td>
    </tr>
  `;
}

function buildEmailHtml(data: {
  name: string;
  email: string;
  phone: string;
  inspectionLabel: string;
  vehicle: string;
  vehicleLocation: string;
  preferredTime: string;
  listingUrl: string;
  message: string;
  pageUrl: string;
  language: string;
}) {
  const receivedAt = new Date().toLocaleString('lt-LT', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Vilnius',
  });

  const listingHtml = data.listingUrl
    ? `<a href="${escapeHtml(data.listingUrl)}" style="color:#0071e3;text-decoration:none;">${escapeHtml(data.listingUrl)}</a>`
    : '';

  const pageUrlHtml = data.pageUrl
    ? `<a href="${escapeHtml(data.pageUrl)}" style="color:#0071e3;text-decoration:none;">${escapeHtml(data.pageUrl)}</a>`
    : '';

  return `<!doctype html>
<html lang="lt">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nauja automobilio patikros užklausa</title>
  </head>
  <body style="margin:0;background:#f7f7f8;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1d1d1f;">
    <div style="padding:28px 16px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e8e8ed;border-radius:8px;overflow:hidden;">
        <div style="padding:24px 28px;background:#111113;color:#f5f5f7;">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;color:#9ecbff;">checkauto.lt</div>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;font-weight:700;">Nauja automobilio patikros užklausa</h1>
          <p style="margin:8px 0 0;color:#c7c7cc;font-size:15px;">Gauta: ${escapeHtml(receivedAt)}</p>
        </div>

        <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
          ${detailRow('Patikros tipas', escapeHtml(data.inspectionLabel))}
          ${detailRow('Automobilis', escapeHtml(data.vehicle))}
          ${detailRow('Automobilio vieta / adresas', escapeHtml(data.vehicleLocation))}
          ${detailRow('Pageidaujamas laikas', escapeHtml(data.preferredTime))}
          ${detailRow('Skelbimo nuoroda', listingHtml)}
          ${detailRow('Vardas', escapeHtml(data.name))}
          ${detailRow('El. paštas', `<a href="mailto:${escapeHtml(data.email)}" style="color:#0071e3;text-decoration:none;">${escapeHtml(data.email)}</a>`)}
          ${detailRow('Telefonas', `<a href="tel:${escapeHtml(data.phone)}" style="color:#0071e3;text-decoration:none;">${escapeHtml(data.phone)}</a>`)}
        </table>

        <div style="padding:20px 28px 8px;">
          <h2 style="margin:0 0 10px;font-size:16px;line-height:1.3;">Papildoma informacija</h2>
          <div style="min-height:48px;padding:14px 16px;background:#f7f7f8;border:1px solid #e8e8ed;border-radius:8px;color:#1d1d1f;font-size:15px;line-height:1.6;">
            ${data.message ? formatMultiline(data.message) : 'Nepateikta'}
          </div>
        </div>

        <div style="padding:16px 28px 24px;color:#6e6e73;font-size:13px;line-height:1.6;">
          ${pageUrlHtml ? `<div>Puslapis: ${pageUrlHtml}</div>` : ''}
          <div>Kalba: ${escapeHtml(data.language || 'lt')}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return jsonResponse(req, { error: 'Method not allowed' }, 405);
  }

  if (!resendApiKey) {
    return jsonResponse(req, { error: 'Missing RESEND_API_KEY.' }, 500);
  }

  let payload: ContactPayload;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse(req, { error: 'Invalid JSON body.' }, 400);
  }

  if (!payload || typeof payload !== 'object') {
    return jsonResponse(req, { error: 'Invalid request body.' }, 400);
  }

  if (cleanText(payload.website, 200)) {
    return jsonResponse(req, { ok: true });
  }

  const name = cleanText(payload.name, 120);
  const email = cleanText(payload.email, 160).toLowerCase();
  const phone = cleanText(payload.phone, 40);
  const inspectionType = cleanText(payload.inspectionType, 60);
  const vehicle = cleanText(payload.vehicle, 180);
  const vehicleLocation = cleanText(payload.vehicleLocation, 200);
  const preferredTime = cleanText(payload.preferredTime, 120);
  const listingUrl = normalizeUrl(payload.listingUrl);
  const rawListingUrl = cleanText(payload.listingUrl, 500);
  const message = cleanMessage(payload.message, 1500);
  const pageUrl = normalizeUrl(payload.pageUrl);
  const language = cleanText(payload.language, 10) || 'lt';
  const inspectionLabel = inspectionTypes[inspectionType];

  if (!name || !email || !phone || !inspectionLabel || !vehicle || !vehicleLocation || !preferredTime) {
    return jsonResponse(req, { error: 'Missing required fields.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(req, { error: 'Invalid email address.' }, 400);
  }

  if (rawListingUrl && !listingUrl) {
    return jsonResponse(req, { error: 'Invalid listing URL.' }, 400);
  }

  try {
    const rateLimit = await checkRateLimit(req, email, phone);

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        { error: 'Too many requests. Please try again later.', scope: rateLimit.scope },
        429,
        { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unexpected rate limit error.');
    return jsonResponse(req, { error: 'Rate limit check unavailable.' }, 503);
  }

  const html = buildEmailHtml({
    name,
    email,
    phone,
    inspectionLabel,
    vehicle,
    vehicleLocation,
    preferredTime,
    listingUrl,
    message,
    pageUrl,
    language,
  });

  try {
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: `checkauto.lt <${senderEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Nauja užklausa: ${inspectionLabel}`,
      html,
    });

    if (error) {
      return jsonResponse(req, { error }, 502);
    }

    return jsonResponse(req, { ok: true, id: data?.id ?? null });
  } catch (error) {
    return jsonResponse(
      req,
      { error: error instanceof Error ? error.message : 'Unexpected Resend error.' },
      502,
    );
  }
});
