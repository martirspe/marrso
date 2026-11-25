import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const descriptions: Record<string, string> = {
  '/': 'Desarrollamos software, soluciones de inteligencia artificial e infraestructura cloud para empresas en Perú. Conoce los servicios y productos de MARRSO.',
  '/ecosistema':
    'Explora Aloja, Agopify, Habix, Reclamo Fácil, Zendix y CotizaFlow: productos digitales creados por el estudio MARRSO.',
  '/servicios':
    'Desarrollo de software, inteligencia artificial, automatización, cloud, diseño web y branding. Definimos soluciones según las necesidades de tu negocio.',
  '/nosotros':
    'Conoce MARRSO, estudio peruano de software e IA aplicada. Desde 2012 desarrollamos plataformas, automatización y soluciones cloud.',
  '/proyectos':
    'Conoce los productos y proyectos de MARRSO en software, inteligencia artificial e infraestructura cloud, y descubre cómo abordamos cada solución.',
  '/contacto':
    'Cuéntanos qué necesitas desarrollar, integrar o mejorar. Contacta con MARRSO para hablar de software, IA, branding o diseño web.',
  '/privacidad':
    'Información sobre el tratamiento de datos personales en el sitio de MARRSO S.A.C.',
  '/terminos': 'Condiciones de uso del sitio web corporativo de MARRSO S.A.C.',
};
@Injectable()
export class SeoStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title =
      this.buildTitle(snapshot) ??
      'Desarrollo de software e inteligencia artificial en Perú — MARRSO';
    const path = snapshot.url.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    const description = descriptions[path] ?? descriptions['/'];
    const url = 'https://marrso.com' + (path === '/' ? '/' : path);
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow,max-image-preview:large' });
    for (const [property, content] of Object.entries({
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': url,
      'og:locale': 'es_PE',
      'og:site_name': 'MARRSO',
    })) {
      this.meta.updateTag({ property, content });
    }
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
    let schema = this.document.getElementById('marrso-schema');
    if (!schema) {
      schema = this.document.createElement('script');
      schema.id = 'marrso-schema';
      schema.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(schema);
    }
    const pageName = path === '/' ? 'Inicio' : title.split(' — ')[0];
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://marrso.com/#organization',
          name: 'MARRSO S.A.C.',
          url: 'https://marrso.com',
          logo: 'https://marrso.com/logos/logo-marrso-black.svg',
          address: { '@type': 'PostalAddress', addressCountry: 'PE' },
        },
        {
          '@type': 'WebSite',
          '@id': 'https://marrso.com/#website',
          url: 'https://marrso.com',
          name: 'MARRSO Studio',
          inLanguage: 'es-PE',
        },
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: title,
          description,
          inLanguage: 'es-PE',
          isPartOf: { '@id': 'https://marrso.com/#website' },
          ...(path === '/'
            ? {}
            : {
                breadcrumb: { '@id': `${url}#breadcrumb` },
              }),
        },
        ...(path === '/'
          ? []
          : [
              {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumb`,
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://marrso.com/' },
                  { '@type': 'ListItem', position: 2, name: pageName, item: url },
                ],
              },
            ]),
      ],
    });
  }
}
