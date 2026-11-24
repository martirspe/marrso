import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.set('trust proxy', 1);
const angularApp = new AngularNodeAppEngine();
const ses = new SESv2Client({ region: process.env['SES_REGION'] || process.env['AWS_REGION'] });

const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const services = new Set([
  'Ingeniería de software',
  'Inteligencia artificial',
  'Cloud & DevOps',
  'Automatización e integración',
  'Diseño y desarrollo web',
  'Branding e identidad visual',
]);

app.post('/api/contact', express.json({ limit: '12kb' }), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const origin = req.get('origin');
  if (origin && origin !== `${req.protocol}://${req.get('host')}`) {
    res.status(403).json({ error: 'Origen no permitido.' });
    return;
  }
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const attempt = contactAttempts.get(ip);
  if (contactAttempts.size > 10000) {
    for (const [key, entry] of contactAttempts)
      if (entry.resetAt <= now) contactAttempts.delete(key);
  }
  if (attempt && attempt.resetAt > now && attempt.count >= 5) {
    res.status(429).json({ error: 'Demasiados intentos. Inténtalo más tarde.' });
    return;
  }
  contactAttempts.set(
    ip,
    attempt && attempt.resetAt > now
      ? { count: attempt.count + 1, resetAt: attempt.resetAt }
      : { count: 1, resetAt: now + 60 * 60 * 1000 },
  );

  const body = req.body;
  const field = (name: string, max: number) =>
    typeof body?.[name] === 'string' && body[name].trim().length <= max
      ? (body[name].trim() as string)
      : null;
  const name = field('name', 120);
  const email = field('email', 254);
  const company = field('company', 160);
  const service = field('service', 100);
  const message = field('message', 4000);
  if (body?.website) {
    res.status(200).json({ ok: true });
    return;
  }
  if (
    !name ||
    !email ||
    (!company && company !== '') ||
    !service ||
    !message ||
    message.length < 20 ||
    !services.has(service) ||
    body?.privacy !== true ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    /[\r\n]/.test(name + email)
  ) {
    res.status(400).json({ error: 'Revisa los datos del formulario.' });
    return;
  }
  const from = process.env['CONTACT_FROM_EMAIL'];
  const to = process.env['CONTACT_TO_EMAIL'];
  if (!(process.env['SES_REGION'] || process.env['AWS_REGION']) || !from || !to) {
    res.status(503).json({ error: 'El formulario no está disponible en este momento.' });
    return;
  }
  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: from,
        ...(process.env['SES_CONFIGURATION_SET']
          ? { ConfigurationSetName: process.env['SES_CONFIGURATION_SET'] }
          : {}),
        Destination: { ToAddresses: [to] },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `Nueva consulta web: ${service}`, Charset: 'UTF-8' },
            Body: {
              Text: {
                Data: `Nombre: ${name}\nCorreo: ${email}\nEmpresa: ${company || 'No indicada'}\nServicio: ${service}\n\n${message}`,
                Charset: 'UTF-8',
              },
            },
          },
        },
      }),
      { abortSignal: AbortSignal.timeout(10000) },
    );
    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ error: 'No se pudo enviar la consulta. Inténtalo de nuevo.' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

const publicPaths = new Set([
  '/',
  '/ecosistema',
  '/servicios',
  '/nosotros',
  '/proyectos',
  '/contacto',
  '/privacidad',
  '/terminos',
]);
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const path = req.path.replace(/\/$/, '') || '/';
  if (publicPaths.has(path)) {
    if (req.path !== path && path !== '/') {
      res.redirect(301, path + req.url.slice(req.path.length));
      return;
    }
    next();
    return;
  }
  res
    .status(404)
    .set('X-Robots-Tag', 'noindex')
    .type('html')
    .send(
      '<!doctype html><html lang="es-PE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Página no encontrada — MARRSO</title></head><body><main><h1>Página no encontrada</h1><p>La dirección que buscas no existe.</p><a href="/">Volver al inicio de MARRSO</a></main></body></html>',
    );
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
