# MARRSO Studio

Sitio de MARRSO desarrollado con Angular 22.

## Desarrollo

```bash
npm ci
npm start
```

El sitio estará disponible en `http://localhost:4200/`.

## Verificación

```bash
npm run typecheck
npm run test:unit
npm run build
```

## Interfaz

### Cookies y medición

El aviso permite aceptar, rechazar y configurar por separado analítica y publicidad. La decisión se conserva 180 días y se puede cambiar desde «Preferencias de cookies» en el pie. Los proveedores no se cargan antes de recibir la autorización correspondiente. La navegación interna genera una sola vista de página por ruta y categoría autorizada.

Configura los identificadores públicos en `public/tracking-config.js`: `ga4` (`G-...`), `meta` (ID numérico) y `tiktok` (ID de Pixel). Los valores vacíos desactivan cada proveedor. No introduzcas tokens de API ni credenciales en ese archivo. Verifica los IDs y eventos en GA4 DebugView, Meta Events Manager y TikTok Events Manager antes de publicar. La integración actual envía únicamente vistas de página; no envía datos del formulario ni eventos de conversión sin una definición y validación adicional.

El formulario envía la consulta desde `POST /api/contact` mediante Amazon SES. El campo «Servicio de interés» usa un desplegable personalizado en escritorio, con navegación por teclado, y el selector nativo en móvil. WhatsApp sigue disponible para conversación inmediata.

La infraestructura SES se gestiona con Terraform en [infra/terraform/README.md](infra/terraform/README.md). Los registros DNS existentes permanecen bajo su estado Terraform actual. En producción define `AWS_REGION` (o `SES_REGION`), `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` y `SES_CONFIGURATION_SET`. El servidor usa la cadena de credenciales estándar de AWS; Terraform prepara un usuario con `ses:SendEmail` limitado al remitente. El formulario devuelve un error y conserva los datos escritos si falta configuración o SES rechaza el envío.

## Producción

Sigue la [guía de despliegue en producción](docs/DEPLOY.md) para preparar el VPS, transferir el `.env` privado, publicar con Docker Compose, configurar HTTPS y verificar el formulario. La infraestructura de correo se opera desde [infra/terraform/README.md](infra/terraform/README.md).

El botón flotante de WhatsApp abre el número de MARRSO y usa el recurso de marca `public/assets/social/whatsapp.svg`. Los iconos de interfaz usan `@lucide/angular`, de acuerdo con `AGENTS.md`.
