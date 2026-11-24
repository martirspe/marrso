# Sistema visual MARRSO — 19 de noviembre de 2026

## Auditoría y decisiones

Stack conservado: Angular 22.2.5, SSR/prerender, Tailwind 4.3.5, Geist local. Sin cambios de framework. Posteriormente se añadió `@lucide/angular` a petición del usuario para unificar la iconografía. La configuración anterior `postcss.config.mjs` no era reconocida por el builder de Angular: Tailwind estaba instalado, pero sus directivas llegaban sin procesar al navegador. Se sustituyó por `.postcssrc.json`, siguiendo https://tailwindcss.com/docs/installation/framework-guides/angular y el código del builder instalado.

La interfaz anterior utilizaba colores oscuros fijos y textos de 5–13 px. Ahora los colores dependen de roles semánticos y ambas apariencias comparten jerarquía y composición. El verde claro de los botones se distingue del verde de texto para mantener contraste en Light. Se preservaron productos, enlaces, rutas, metadatos y demos; no se añadieron clientes ni métricas comerciales.

## Archivos y arquitectura

- `src/styles.css`: paletas, tokens semánticos, tipografía fluida, superficies, bordes, foco, sombras, radios, espaciado y movimiento. Mapeo `@theme inline`, variante `dark` y patrones reutilizables mediante `@apply` en la capa de componentes. El contenedor se llama `site-container` para evitar colisiones con Tailwind.
- `.postcssrc.json`: integración efectiva de Tailwind; sustituye `postcss.config.mjs`.
- `public/theme-init.js`, `src/index.html`: inicialización síncrona antes del render, mediante archivo del mismo origen. No se añadió JavaScript inline ni se relajó CSP. No existe una CSP declarada en la configuración actual de Express/nginx; una política futura debe permitir este recurso.
- `theme.service.ts`, `theme-switcher.component.ts`: servicio singleton con Signals y selector accesible Claro/Oscuro/Sistema. Persistencia, cambios del SO, sincronización entre pestañas y tolerancia a almacenamiento bloqueado. La plantilla inicial coincide entre servidor y cliente; el servicio se sincroniza después del primer render.
- `site-shell.component.*`: header, navegación móvil, Escape con retorno de foco, selector de apariencia y footer.
- `hero.component.html/css`, `orbit-art.component.ts`: composición editorial y visual de arquitectura conectada. SVG adaptado al tema y reducido de 72 a 36 trazos; pausa y reduced-motion conservados.
- `ecosystem.component.html/css`: productos y demos con superficies semánticas, botones táctiles, contenido sin altura rígida y container queries.
- `engineering.component.ts`, `home.page.html/css`, `content.page.ts`: servicios editoriales, explorador de arquitectura, método, manifiesto, FAQ, cierre y páginas interiores.
- `contact.page.ts`, `legal.page.ts`, `app.css`: integración visual y foco. El formulario envía consultas mediante el endpoint del servidor.
- `playwright.config.ts`, `tests/experience.spec.ts`: pruebas funcionales, responsive y contraste.
- `eslint.config.mjs`, `package.json`, `.prettierignore`, `.gitignore`: comandos y alcance de validaciones. Lint cubre plantillas HTML externas y bootstrap JS; TypeScript se verifica con `tsc` y el compilador Angular.

## Verificación

- Build de producción y ocho rutas prerenderizadas.
- Nueve pruebas Vitest de contenido indexable, títulos, metadatos y datos estructurados.
- Seis pruebas Playwright con Edge durante esta revisión visual: 112 combinaciones (8 rutas × 7 anchos × 2 temas), sin overflow horizontal ni errores JS; persistencia y cambios de sistema; sincronización entre pestañas; teclado, Escape y reduced-motion; demos y FAQ; validación del formulario; bootstrap sin Angular y con almacenamiento bloqueado; contraste de tokens.
- Anchos: 360, 390, 768, 1024, 1280, 1440 y 1920 px.
- Texto de las paletas comprobado contra canvas, superficie y superficie elevada con mínimo 4.5:1. Texto del CTA mínimo 4.5:1 y borde de inputs contra su fondo mínimo 3:1.
- Dos pasadas visuales: la primera permitió corregir la integración Tailwind, la colisión del contenedor, los saltos del titular y el exceso de color en el manifiesto. La segunda revisó ambos temas, móvil, tablet, servicios y contacto. Capturas en `docs/qa/`.

## Reproducir

```sh
npm test
npm run typecheck
npm run lint
npm run format:check
npm start -- --host 127.0.0.1 --port 4300
# En otra terminal, con Edge instalado:
npm run test:e2e
node docs/qa/capture.cjs
```

Playwright usa Edge instalado; no descarga navegadores. `QA_URL` permite apuntar las pruebas a otra URL. En este entorno fue necesario ejecutar navegador y servidor fuera del sandbox para que compartieran acceso a loopback.

## Límites

Esta revisión visual no incluye una medición de Core Web Vitals de campo, certificación WCAG, prueba con lector de pantalla real ni verificación en Safari/Firefox/dispositivos físicos. La cobertura de contraste corresponde a tokens y combinaciones especificadas, no a una auditoría automatizada integral de cada píxel. La operación de producción se documenta en [DEPLOY.md](DEPLOY.md).

## Iconografía

Todos los iconos de interfaz usan `@lucide/angular`, con imports standalone por icono y `LucideDynamicIcon` para el selector de apariencia. Se sustituyeron símbolos Unicode, flechas CSS y SVG manuales del selector. El logotipo y las ilustraciones de producto se conservan como identidad visual. La regla queda recogida en `AGENTS.md`.

## Navegación y retorno al inicio — 21 de noviembre de 2026

El hover del header usa color de acento y subrayado fino, sin fondos de bloque. El desplegable utiliza un indicador lateral. El botón flotante de volver arriba usa LucideArrowUp, mide 44 px y aparece sobre WhatsApp después de superar el hero, sin desplazar el contacto. Respeta movimiento reducido y devuelve el foco al contenido. Se eliminó el enlace duplicado del footer y su import de icono.

Validación: compilación, lint, TypeScript, formato, 9 pruebas unitarias y 8 pruebas Playwright, incluidas visibilidad, posición estable del contacto y retorno por teclado en móvil y escritorio. Capturas del hover y controles flotantes en `docs/qa`.

## Header y contacto flotante — 20 de noviembre de 2026

El header y el footer usan los SVG originales de `public/logos`: negro para Claro y blanco para Oscuro. La selección se realiza con la variante CSS `dark`, de modo que también respeta Sistema desde el primer render. El header incorpora navegación con estado activo, dropdown de productos, cierre con Escape, clic exterior y salida de foco; los menús se cierran al navegar o cambiar de ancho. El menú móvil tiene controles de 44 px y altura limitada al viewport.

`whatsapp-fab.component.ts` adapta la posición, tamaño circular, safe areas y feedback de hover al diseño del sitio. Usa `LucideMessageCircle` y el enlace `https://wa.me/51957049957`, con nombre accesible y apertura segura en pestaña nueva. No se enviaron mensajes para probarlo.

Validación: build, lint, TypeScript, formato, 9 pruebas Vitest y 7 pruebas Playwright sobre las páginas prerenderizadas. Inspección visual del header en ambos temas y del menú móvil a 360 px. Capturas `docs/qa/header-*.png`. Se verificaron los destinos de enlace y la carga real de los logos.

El selector de apariencia espera a que termine la hidratación antes de aceptar cambios. En desarrollo se activó la optimización de scripts (con source maps conservados) y se desactivó el prebundle: esto evita servir el catálogo completo de Lucide durante el arranque. Se verificaron además dos pruebas de primera carga, persistencia y navegación en `ng serve`, ambas correctas.
