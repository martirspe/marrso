# MARRSO Studio — dirección visual y verificación

## Dirección

Identidad oscura, tipografía Geist local, acento principal #ccff00 y violeta reservado para inteligencia y conexiones. Geometría orbital SVG original, animada con transformaciones CSS; control de pausa y preferencia de movimiento reducido. No se usa WebGL ni un motor 3D.

El símbolo M y el wordmark son propuestas provisionales, pendientes de aprobación corporativa.

## Arquitectura

Angular 22, standalone, Signals, zoneless, TypeScript y templates estrictos. Rutas lazy-loaded y ocho páginas prerenderizadas. Componentes compartidos para navegación, hero, geometría orbital, ecosistema y explorador de arquitectura. Tailwind 4 y tokens CSS globales. Geist y Geist Mono se sirven localmente en WOFF2.

Los metadatos por ruta, canonical, Open Graph y JSON-LD se generan con una estrategia de títulos Angular también durante prerendering.

## Ejecución

- Desarrollo: `npm start` y abrir http://localhost:4200.
- Producción: `npm run build`, después `npm run serve:ssr:marrso-studio`.
- Contratos de prerender: `npm test` (compila antes de inspeccionar el HTML).
- Formato: `npm run format:check`.

## Integraciones y límites

- Las demostraciones de productos son conceptuales. No muestran telemetría real ni resultados comerciales.
- El enlace oficial de Agopify no se proporcionó. Sus CTA conducen a Contacto.
- El formulario valida y descarga un resumen local en texto plano. No transmite datos, no registra información personal y no simula un envío. El canal comercial necesita proveedor, dirección de destino y protección contra abuso antes de habilitar envíos.
- Política de privacidad y términos conservan el contenido informativo anterior. Requieren información corporativa y revisión legal antes de un lanzamiento público.
- Docker/Nginx existentes se preservan; no se ha desplegado ni configurado una cuenta Cloudflare.
- El paquete Lucide Angular no se incorpora en esta pasada; se mantiene iconografía vectorial y tipográfica ligera.
- No se atribuyen puntuaciones Lighthouse ni Core Web Vitals sin medición.
- La consulta npm audit detectó cinco alertas moderadas en herramientas de desarrollo ligadas a minimatch/ESLint. No se aplicó una migración de versión mayor de ESLint como parte del rediseño.

## QA de esta revisión

Comprobación visual en navegador de escritorio y móvil. Anchos 320, 375, 390, 768, 1024, 1440 y 1920 sin desbordamiento horizontal de la home. Comprobadas pausa ambiental, selección de conversación, búsqueda conceptual, explorador de capas, FAQ, menú móvil, cambio entre páginas internas y canonical por ruta.

Las pruebas de HTML prerenderizado verifican contenido, idioma, encabezado principal, canonical, metadatos sociales, JSON-LD y títulos únicos. No sustituyen una auditoría completa WCAG o una medición de rendimiento en dispositivos reales.
