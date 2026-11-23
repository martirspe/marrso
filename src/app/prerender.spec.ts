import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// These contract tests run after the production build and inspect real prerendered pages.
const routes = [
  '',
  'ecosistema',
  'servicios',
  'nosotros',
  'proyectos',
  'contacto',
  'privacidad',
  'terminos',
];
describe('Páginas públicas prerenderizadas', () => {
  for (const route of routes) {
    it('entrega contenido y metadatos indexables en /' + route, () => {
      const html = readFileSync(
        join(process.cwd(), 'dist/marrso-studio/browser', route, 'index.html'),
        'utf8',
      );
      expect(html).toContain('lang="es-PE"');
      expect(html.match(/<h1\b/g)).toHaveLength(1);
      expect(html).toContain('href="https://marrso.com/' + route + '"');
      expect(html).toContain('property="og:title"');
      expect(html).toContain('name="description"');
      const schema = html.match(/<script[^>]*id="marrso-schema"[^>]*>([\s\S]*?)<\/script>/)?.[1];
      expect(schema).toBeTruthy();
      expect(JSON.parse(schema!)['@graph']).toHaveLength(3);
      expect(html).not.toContain('Congratulations');
    });
  }
  it('entrega títulos únicos para cada ruta', () => {
    const titles = routes.map(
      (route) =>
        readFileSync(
          join(process.cwd(), 'dist/marrso-studio/browser', route, 'index.html'),
          'utf8',
        ).match(/<title>(.*?)<\/title>/)?.[1],
    );
    expect(new Set(titles).size).toBe(routes.length);
  });
});
