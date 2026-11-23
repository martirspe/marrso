import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const descriptions: Record<string, string> = {
  '/': 'MARRSO: estudio de ingeniería de software e inteligencia artificial en Perú. Diseñamos plataformas SaaS, sistemas inteligentes e infraestructura cloud.',
  '/ecosistema':
    'Conoce Aloja Cloud, Agopify, Habix, Reclamo Fácil, Zendix y CotizaFlow: el ecosistema de productos de MARRSO.',
  '/servicios':
    'Ingeniería de software empresarial, inteligencia artificial, arquitectura cloud y automatización de procesos con MARRSO.',
  '/nosotros':
    'Conoce MARRSO, un estudio de ingeniería que combina software, inteligencia artificial e infraestructura cloud en Perú.',
  '/proyectos':
    'Explora los productos y soluciones del ecosistema MARRSO: infraestructura, comercio conversacional y servicios digitales.',
  '/contacto':
    'Prepara y descarga un resumen de tu proyecto de software, IA o cloud. El formulario no envía tu consulta a MARRSO.',
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
    const title = this.buildTitle(snapshot) ?? 'MARRSO — Software, IA e infraestructura cloud';
    const path = snapshot.url.split(/[?#]/)[0];
    const description = descriptions[path] ?? descriptions['/'];
    const url = 'https://marrso.com' + path;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });
    for (const [property, content] of Object.entries({
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': url,
      'og:locale': 'es_PE',
      'og:site_name': 'MARRSO Studio',
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
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://marrso.com/#organization',
          name: 'MARRSO S.A.C.',
          url: 'https://marrso.com',
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
          url,
          name: title,
          description,
          inLanguage: 'es-PE',
          isPartOf: { '@id': 'https://marrso.com/#website' },
        },
      ],
    });
  }
}
