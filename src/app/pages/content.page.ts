import { LucideCheck, LucideChevronRight } from '@lucide/angular';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteShellComponent } from '../shared/site-shell.component';
import { EcosystemComponent } from '../shared/ecosystem.component';
import { EngineeringComponent } from '../shared/engineering.component';
import { OrbitArtComponent } from '../shared/orbit-art.component';

const CONTENT = {
  ecosistema: {
    label: 'Ecosistema',
    eyebrow: 'ECOSISTEMA MARRSO',
    title: 'Encuentra el producto para tu necesidad.',
    lede: 'Productos propios para crear interfaces web con IA, orientar compras, buscar propiedades y gestionar reclamaciones.',
  },
  servicios: {
    label: 'Servicios',
    eyebrow: 'SERVICIOS MARRSO',
    title: 'Conectamos tu marca, tu web y tu operación.',
    lede: 'Desarrollamos software para resolver cómo trabaja tu negocio. Integramos branding y diseño web para que lo que comunicas, lo que vendes y lo que gestionas funcionen en conjunto.',
  },
  nosotros: {
    label: 'Estudio',
    eyebrow: 'EL ESTUDIO',
    title: 'Experiencia que conecta negocio y tecnología.',
    lede: 'Somos un estudio peruano de software e IA aplicada con trayectoria desde 2019. Evolucionamos del desarrollo web y el comercio electrónico hacia plataformas empresariales, automatización y cloud.',
  },
  proyectos: {
    label: 'Proyectos',
    eyebrow: 'PROYECTOS MARRSO',
    title: 'Así aplicamos nuestra ingeniería.',
    lede: 'Explora el ecosistema de productos MARRSO y las áreas donde combinamos software, inteligencia artificial e infraestructura cloud.',
  },
} as const;
@Component({
  imports: [
    LucideCheck,
    LucideChevronRight,
    SiteShellComponent,
    RouterLink,
    EcosystemComponent,
    EngineeringComponent,
    OrbitArtComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-site-shell
    ><main tabindex="-1" id="contenido" [class.services-page]="page() === 'servicios'">
      <section class="page-hero">
        <div class="site-container">
          <nav class="breadcrumb" aria-label="Ruta de navegación">
            <ol>
              <li><a routerLink="/">Inicio</a></li>
              <li>
                <svg lucideChevronRight class="ui-icon" aria-hidden="true"></svg
                ><span aria-current="page">{{ content().label }}</span>
              </li>
            </ol>
          </nav>
          <p class="eyebrow">{{ content().eyebrow }}</p>
          <h1 class="display">{{ content().title }}</h1>
          <p class="lede">{{ content().lede }}</p>
          @if (page() === 'servicios') {
            <div class="services-actions">
              <a class="button primary" routerLink="/contacto">Cuéntanos tu proyecto</a>
              <a class="text-link" routerLink="/servicios" fragment="capacidades"
                >Explorar servicios</a
              >
            </div>
          }
        </div>
      </section>
      @if (page() === 'servicios') {
        <nav class="site-container services-index" aria-label="Encuentra tu servicio">
          @for (service of services; track service.id) {
            <a routerLink="/servicios" [fragment]="service.id">{{ service.shortName }}</a>
          }
        </nav>
      }
      @if (page() === 'ecosistema' || page() === 'proyectos') {
        <section class="section">
          <div class="site-container">
            <div class="section-head">
              <div>
                <p class="eyebrow">DESDE EL ESTUDIO</p>
                <h2 class="h2">
                  {{
                    page() === 'proyectos'
                      ? 'Explora nuestros productos y sus casos de uso.'
                      : 'Distintas necesidades. Productos especializados.'
                  }}
                </h2>
              </div>
              <p>
                Las interfaces que ves a continuación son demostraciones conceptuales de cada
                producto.
              </p>
            </div>
            <app-ecosystem />
          </div>
        </section>
        @if (page() === 'proyectos') {
          <section class="section">
            <div class="site-container approach">
              <p class="eyebrow">EL SIGUIENTE PROYECTO</p>
              <div>
                <h2 class="h2">Tu contexto define<br />la solución.</h2>
                <p class="lede">
                  Una plataforma empresarial. Un sistema de atención con IA. La integración de una
                  operación fragmentada. Partimos del problema para diseñar una arquitectura que
                  tenga sentido.
                </p>
                <a class="text-link" routerLink="/servicios">Explorar nuestras capacidades</a>
              </div>
            </div>
          </section>
        }
      }
      @if (page() === 'servicios') {
        <section class="section services-intro" aria-labelledby="services-approach">
          <div class="site-container approach">
            <p class="eyebrow">EL ALCANCE PARTE DE TU NECESIDAD</p>
            <div>
              <h2 class="h2" id="services-approach">
                Una capacidad concreta.<br />O un proyecto conectado.
              </h2>
              <p class="lede">
                Puedes trabajar con MARRSO tu marca, tu web o tu software por separado. Si el
                proyecto necesita conectar esas piezas, definimos un alcance conjunto: desde cómo
                presentas tu oferta hasta cómo recibes una consulta y gestionas un pedido.
              </p>
              <p class="lede">
                Partimos de lo que ya tienes. Acordamos entregables, integraciones y prioridades
                según el problema que necesitas resolver.
              </p>
            </div>
          </div>
        </section>
        <section class="section services-catalog" id="capacidades" aria-label="Nuestros servicios">
          <div class="site-container service-grid">
            @for (service of services; track service.name) {
              <article [id]="service.id" [attr.aria-labelledby]="service.id + '-title'">
                <span class="eyebrow">{{ service.category }}</span>
                <h2 [id]="service.id + '-title'">{{ service.name }}</h2>
                <p>{{ service.text }}</p>
                <ul>
                  @for (item of service.items; track item) {
                    <li>
                      <svg lucideCheck class="ui-icon" aria-hidden="true"></svg
                      ><span>{{ item }}</span>
                    </li>
                  }
                </ul>
                <a
                  class="text-link"
                  routerLink="/contacto"
                  [queryParams]="{ servicio: service.name }"
                  [attr.aria-label]="'Consultar sobre ' + service.name"
                  >Consultar este servicio</a
                >
              </article>
            }
          </div>
        </section>
        <app-engineering />
      }
      @if (page() === 'nosotros') {
        <section class="section">
          <div class="site-container studio-body">
            <div class="studio-art"><app-orbit-art [paused]="true" /></div>
            <div>
              <p class="eyebrow">SOFTWARE × IA × CLOUD</p>
              <h2 class="h2">Construir bien.<br />Pensar a largo plazo.</h2>
              <p class="lede">
                Combinamos ingeniería de software, inteligencia artificial y arquitectura cloud para
                convertir desafíos complejos en sistemas funcionales, seguros y escalables.
              </p>
              <p class="lede">
                Integramos branding y diseño web para dar continuidad entre la identidad del
                negocio, la experiencia de sus clientes y los sistemas que sostienen su operación.
              </p>
            </div>
          </div>
        </section>
        <section class="section">
          <div class="site-container values">
            @for (value of values; track value.title) {
              <article>
                <span class="eyebrow">{{ value.n }}</span>
                <h2>{{ value.title }}</h2>
                <p>{{ value.text }}</p>
              </article>
            }
          </div>
        </section>
      }
    </main></app-site-shell
  >`,
  styleUrl: './services.page.css',
  styles: `
    .page-hero {
      padding: 28px 0 48px;
      min-height: 430px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to bottom, var(--background), var(--surface) 140px);
      border-bottom: 1px solid var(--border-subtle);
    }
    .page-hero > .site-container {
      position: relative;
    }
    .breadcrumb {
      margin-bottom: 24px;
      font-size: 0.875rem;
      color: var(--secondary);
    }
    .breadcrumb ol,
    .breadcrumb li {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .breadcrumb ol {
      list-style: none;
      padding: 0;
      margin: 0;
      flex-wrap: wrap;
    }
    .breadcrumb a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .breadcrumb a:hover,
    .breadcrumb [aria-current] {
      color: var(--foreground);
    }
    .breadcrumb .ui-icon {
      width: 14px;
      height: 14px;
    }
    .page-hero .eyebrow {
      margin: 0;
      font-size: 0.8125rem;
    }
    .page-hero h1 {
      max-width: 22ch;
      font-size: clamp(2.5rem, 4.5vw, 4.5rem);
      line-height: 1.08;
      letter-spacing: -0.05em;
      text-wrap: balance;
      margin: 16px 0 24px;
    }
    .page-hero .lede {
      max-width: 68ch;
      margin: 0;
      text-wrap: pretty;
    }
    .page-hero + .section {
      padding-top: clamp(2.5rem, 4vw, 4rem);
      border-top: 0;
    }
    .service-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0;
    }
    .service-grid article {
      padding: 40px 0;
      border-bottom: 1px solid var(--border);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 48px;
    }
    .service-grid article > .eyebrow {
      grid-column: 1 / -1;
    }
    .service-grid .text-link {
      justify-self: start;
      align-self: end;
    }
    .service-grid article {
      scroll-margin-top: 140px;
    }
    .service-grid h2 {
      font-size: 1.875rem;
      letter-spacing: -0.04em;
      line-height: 1.1;
      font-weight: 500;
      margin: 28px 0 20px;
    }
    .service-grid p {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--secondary);
    }
    .service-grid ul {
      list-style: none;
      padding: 20px 0;
      border-top: 1px solid var(--border);
      display: grid;
      gap: 12px;
      font-size: 1rem;
      color: var(--secondary);
    }
    .service-grid li {
      display: flex;
      align-items: start;
      gap: 12px;
    }
    .service-grid li .ui-icon {
      color: var(--accent);
      margin-top: 3px;
    }
    .studio-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 70px;
      align-items: center;
    }
    .studio-art {
      max-width: 530px;
    }
    .values {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }
    .values article {
      border-top: 1px solid var(--border);
      padding-top: 25px;
    }
    .values h2 {
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: -0.04em;
      margin-top: 24px;
    }
    .values p {
      font-size: 1rem;
      color: var(--secondary);
      line-height: 1.7;
    }
    .approach {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 40px;
    }
    @media (max-width: 760px) {
      .page-hero {
        padding: 16px 0 32px;
        min-height: 0;
      }
      .breadcrumb {
        margin-bottom: 20px;
      }
      .service-grid,
      .studio-body,
      .values,
      .approach {
        grid-template-columns: 1fr;
        gap: 25px;
      }
      .service-grid article {
        padding: 24px 0;
        grid-template-columns: 1fr;
      }
      .studio-art {
        width: 85%;
        margin: auto;
      }
      .values article {
        padding-bottom: 10px;
      }
    }
  `,
})
export class ContentPage {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  readonly page = computed(() => (this.data()['page'] ?? 'servicios') as keyof typeof CONTENT);
  readonly content = computed(() => CONTENT[this.page()]);
  readonly services = [
    {
      id: 'software',
      shortName: 'Software',
      category: 'DESARROLLO A MEDIDA',
      name: 'Ingeniería de software',
      text: 'Cuando tus herramientas ya no acompañan tu operación, diseñamos aplicaciones e integraciones adaptadas a tus procesos, usuarios y prioridades.',
      items: [
        'Aplicaciones web empresariales y plataformas SaaS',
        'APIs, microservicios e integraciones',
        'Modernización de sistemas y arquitectura modular',
      ],
    },
    {
      id: 'inteligencia-artificial',
      shortName: 'Inteligencia artificial',
      category: 'INTELIGENCIA APLICADA',
      name: 'Inteligencia artificial',
      text: 'Conecta la información de tu negocio con asistentes, búsquedas y procesos que ayuden a tu equipo. Definimos qué puede hacer la IA y cuándo debe intervenir una persona.',
      items: [
        'Agentes conversacionales y orquestación',
        'Sistemas RAG y búsqueda semántica',
        'Procesamiento de documentos e integración de LLMs',
      ],
    },
    {
      id: 'cloud',
      shortName: 'Cloud & DevOps',
      category: 'INFRAESTRUCTURA Y OPERACIÓN',
      name: 'Cloud & DevOps',
      text: 'Infraestructura y procesos de entrega que permiten desplegar, observar y mejorar el comportamiento de un sistema.',
      items: [
        'Arquitectura cloud e infraestructura como código',
        'Contenedores y procesos CI/CD',
        'Monitoreo, rendimiento y configuración de seguridad',
      ],
    },
    {
      id: 'automatizacion',
      shortName: 'Automatización',
      category: 'PROCESOS CONECTADOS',
      name: 'Automatización e integración',
      text: 'Conectamos herramientas y procesos para que la información fluya y el trabajo repetitivo deje de ser un obstáculo.',
      items: [
        'Integración de APIs y plataformas externas',
        'Flujos de trabajo entre áreas y herramientas',
        'Automatización comercial y operativa',
      ],
    },
    {
      id: 'diseno-web',
      shortName: 'Diseño web',
      category: 'EXPERIENCIA DIGITAL',
      name: 'Diseño y desarrollo web',
      text: 'Una web debe ayudar a entender tu oferta y facilitar el siguiente paso. Diseñamos el recorrido desde la primera visita hasta la consulta, cotización o compra, con las conexiones que tu operación necesita.',
      items: [
        'Sitios corporativos, landing pages y tiendas online',
        'Estructura de contenidos y diseño adaptable a móviles',
        'Formularios, cotizadores e integración con tus herramientas según alcance',
      ],
    },
    {
      id: 'branding',
      shortName: 'Branding',
      category: 'IDENTIDAD DE MARCA',
      name: 'Branding e identidad visual',
      text: 'Cuando tu marca no expresa el valor de lo que haces, cada presentación exige explicarlo de nuevo. Creamos una identidad reconocible y coherente, pensada para aplicarse en tu web, tus materiales comerciales y tus productos digitales.',
      items: [
        'Definición de la marca a partir de su propuesta y público',
        'Logotipo, tipografía, color y sistema visual',
        'Guía de identidad y aplicaciones acordadas para tu negocio',
      ],
    },
  ];
  readonly values = [
    {
      n: '01 / CRITERIO',
      title: 'Primero, entender.',
      text: 'Una tecnología es útil cuando responde a una necesidad concreta. Las decisiones empiezan por el problema.',
    },
    {
      n: '02 / INGENIERÍA',
      title: 'La calidad se diseña.',
      text: 'Arquitectura, accesibilidad, seguridad y mantenimiento forman parte de la construcción desde el inicio.',
    },
    {
      n: '03 / EVOLUCIÓN',
      title: 'Pensar más allá del lanzamiento.',
      text: 'El software vive y cambia. Construimos con una visión que contempla su operación y evolución.',
    },
  ];
}
