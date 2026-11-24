# MARRSO Studio

Sitio web de MARRSO para presentar sus servicios, productos y proyectos, y recibir consultas comerciales. Está desarrollado con Angular 22, renderizado en servidor y prerenderizado de las rutas públicas. Un servidor Express atiende `POST /api/contact` y envía las consultas mediante Amazon SES.

## Requisitos

- Node.js compatible con Angular 22 y npm.
- Para el despliegue: Docker con Compose, nginx y Certbot en el VPS.
- Para habilitar el formulario: una identidad verificada de Amazon SES y credenciales de envío. La infraestructura se define en [infra/terraform/](infra/terraform/README.md).

## Empezar en local

```bash
git clone https://github.com/martirspe/marrso.git
cd marrso
npm ci
npm start
```

Abre `http://localhost:4200/`. La navegación y la interfaz pueden desarrollarse sin credenciales de AWS; el envío del formulario requiere configurar SES. Las variables de producción están documentadas en [.env.production.example](.env.production.example). No subas archivos `.env` con credenciales al repositorio.

## Qué incluye

- Páginas de inicio, ecosistema, servicios, nosotros, proyectos, contacto, privacidad y términos.
- Renderizado en servidor, prerenderizado de las rutas públicas y metadatos SEO por página.
- Diseño adaptable con apariencia clara, oscura y según el sistema. Los iconos de interfaz usan `@lucide/angular`.
- Formulario de contacto con validación del lado del servidor, límite de intentos, campo trampa contra envíos automatizados y envío por SES. El correo del visitante se utiliza como `Reply-To`.
- Preferencias separadas para analítica y publicidad, conservadas durante 180 días y modificables desde el pie de página.

## Configuración

### Correo del formulario

El servidor necesita `AWS_REGION` (o `SES_REGION`), `CONTACT_FROM_EMAIL` y `CONTACT_TO_EMAIL`. En producción usa también `SES_CONFIGURATION_SET=marrso-prod-contact` para asociar los envíos a eventos y alertas. El SDK de AWS obtiene las credenciales mediante su cadena estándar; en el VPS, el archivo `.env` privado contiene la clave del usuario IAM limitado a `ses:SendEmail`.

La identidad SES, el conjunto de configuración, los permisos IAM y las alertas se administran con Terraform. Consulta [la guía de infraestructura SES](infra/terraform/README.md) antes de modificar estos recursos. Si SES no está configurado o rechaza el envío, el formulario informa del error y conserva los datos introducidos.

### Analítica y publicidad

Los identificadores públicos se configuran en [public/tracking-config.js](public/tracking-config.js): `ga4` (`G-...`), `meta` (ID numérico) y `tiktok` (ID de Pixel). Un valor vacío desactiva el proveedor. No pongas tokens ni credenciales en ese archivo.

Los proveedores se cargan después del consentimiento correspondiente. La integración actual registra vistas de página; no transmite datos del formulario ni eventos de conversión. Verifica los identificadores y eventos en las herramientas de cada proveedor antes de publicar.

## Verificación

```bash
npm run typecheck
npm run test:unit
npm run build
```

`npm run test:e2e` ejecuta Playwright y requiere el navegador configurado en [playwright.config.ts](playwright.config.ts). `npm run format:check` revisa el formato. La compilación genera el cliente y el servidor en `dist/marrso-studio/`.

## Despliegue

Sigue [docs/DEPLOY.md](docs/DEPLOY.md) desde la conexión al VPS y la clonación de `main` hasta HTTPS, verificación y rollback. El despliegue usa Docker Compose y `scripts/deploy.sh`; la aplicación se expone solo en loopback y nginx publica el dominio.

## Documentación

| Documento                                        | Contenido                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| [Despliegue en producción](docs/DEPLOY.md)       | Primer despliegue, actualizaciones, verificaciones y diagnóstico. |
| [Infraestructura SES](infra/terraform/README.md) | Terraform, estado remoto, DNS de correo y operación de alertas.   |
| [Implementación](docs/IMPLEMENTACION.md)         | Arquitectura y límites funcionales.                               |
| [Sistema visual](docs/DESIGN-SYSTEM.md)          | Decisiones de diseño, accesibilidad y verificación visual.        |
