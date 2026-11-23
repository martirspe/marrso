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

El formulario de contacto permite preparar y descargar un resumen local del proyecto; no envía los datos a MARRSO. El campo «Servicio de interés» usa un desplegable personalizado en escritorio, con navegación por teclado, y el selector nativo en móvil.

El botón flotante de WhatsApp abre el número de MARRSO. Su imagen de marca y sus colores se tomaron del botón de Reclamo Fácil; el archivo se encuentra en `public/assets/social/whatsapp.svg`. Los demás iconos de interfaz usan `@lucide/angular`, de acuerdo con `AGENTS.md`.
