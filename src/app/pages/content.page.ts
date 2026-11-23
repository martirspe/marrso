import { LucideCheck } from '@lucide/angular';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteShellComponent } from '../shared/site-shell.component';
import { EcosystemComponent } from '../shared/ecosystem.component';
import { EngineeringComponent } from '../shared/engineering.component';
import { OrbitArtComponent } from '../shared/orbit-art.component';

const CONTENT = {
  ecosistema: {
    eyebrow: 'ECOSISTEMA MARRSO',
    title: 'Encuentra el producto para tu necesidad.',
    lede: 'Productos propios para crear interfaces web con IA, orientar compras, buscar propiedades y gestionar reclamaciones.',
  },
  servicios: {
    eyebrow: 'SERVICIOS DE INGENIERÍA',
    title: 'Software a la medida de tu operación.',
    lede: 'Diseñamos, construimos y evolucionamos soluciones digitales. La tecnología se elige a partir del problema y del contexto de cada organización.',
  },
  nosotros: {
    eyebrow: 'EL ESTUDIO',
    title: 'Experiencia que conecta negocio y tecnología.',
    lede: 'Somos un estudio peruano de tecnología con trayectoria desde 2019. Evolucionamos del desarrollo web y el comercio electrónico hacia software empresarial, cloud e inteligencia artificial aplicada.',
  },
  proyectos: {
    eyebrow: 'PRODUCTOS Y SOLUCIONES',
    title: 'Así aplicamos nuestra ingeniería.',
    lede: 'Explora el ecosistema de productos MARRSO y las áreas donde combinamos software, inteligencia artificial e infraestructura cloud.',
  },
} as const;
@Component({
  imports: [
    LucideCheck,
    SiteShellComponent,
    RouterLink,
    EcosystemComponent,
    EngineeringComponent,
    OrbitArtComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-site-shell
    ><main id="contenido">
      <section class="page-hero">
        <div class="site-container">
          <a class="breadcrumb mono" routerLink="/">MARRSO / INICIO</a>
          <p class="eyebrow">{{ content().eyebrow }}</p>
          <h1 class="display">{{ content().title }}</h1>
          <p class="lede">{{ content().lede }}</p>
          <span class="page-index mono"
            >M /
            {{
              page() === 'ecosistema'
                ? '01'
                : page() === 'servicios'
                  ? '02'
                  : page() === 'nosotros'
                    ? '03'
                    : '04'
            }}</span
          >
        </div>
      </section>
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
        <section class="section">
          <div class="site-container service-grid">
            @for (service of services; track service.name; let i = $index) {
              <article [id]="service.id">
                <span class="eyebrow">0{{ i + 1 }} / CAPACIDAD</span>
                <h2>{{ service.name }}</h2>
                <p>{{ service.text }}</p>
                <ul>
                  @for (item of service.items; track item) {
                    <li>
                      <svg lucideCheck class="ui-icon" aria-hidden="true"></svg
                      ><span>{{ item }}</span>
                    </li>
                  }
                </ul>
                <a class="text-link" routerLink="/contacto">Prepara tu proyecto</a>
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
                Nuestros productos son otra expresión de esa visión: explorar problemas reales,
                tomar decisiones técnicas conscientes y acompañar cada solución mientras evoluciona.
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
  styles: `
    .page-hero {
      padding: 70px 0 85px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to bottom, var(--background), var(--surface) 140px);
      border-bottom: 1px solid var(--border-subtle);
    }
    .page-hero > .site-container {
      position: relative;
    }
    .breadcrumb {
      font-size: 0.75rem;
      color: var(--muted);
      letter-spacing: 0.1em;
      display: inline-block;
      margin-bottom: 50px;
    }
    .page-hero h1 {
      max-width: 1000px;
    }
    .page-hero .lede {
      max-width: 650px;
    }
    .page-index {
      position: absolute;
      right: 0;
      bottom: 0;
      color: var(--muted);
      font-size: 0.75rem;
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
        padding: 45px 0 65px;
      }
      .breadcrumb {
        margin-bottom: 35px;
      }
      .page-index {
        display: none;
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
      name: 'Automatización e integración',
      text: 'Conectamos herramientas y procesos para que la información fluya y el trabajo repetitivo deje de ser un obstáculo.',
      items: [
        'Integración de APIs y plataformas externas',
        'Flujos de trabajo entre áreas y herramientas',
        'Automatización comercial y operativa',
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
