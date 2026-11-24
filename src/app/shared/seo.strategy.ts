import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const descriptions: Record<string, string> = {
  '/': 'MARRSO: estudio de software e IA aplicada en Perú. Diseñamos plataformas SaaS, sistemas inteligentes e infraestructura cloud.',
  '/ecosistema':
    'Conoce Aloja, Agopify, Habix, Reclamo Fácil, Zendix y CotizaFlow: el ecosistema de productos de MARRSO.',
  '/servicios':
    'Software, IA y automatización para tu operación. Branding y diseño web para conectar tu identidad, tu oferta y la experiencia de tus clientes con MARRSO.',
  '/nosotros':
    'Conoce MARRSO, un estudio peruano de software e IA aplicada que combina desarrollo, automatización e infraestructura cloud.',
  '/proyectos':
    'Explora los productos y soluciones del ecosistema MARRSO: infraestructura, comercio conversacional y servicios digitales.',
  '/contacto':
    'Contacta con MARRSO sobre tu proyecto de software, branding o diseño web. Envía tu consulta o conversa por WhatsApp.',
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
