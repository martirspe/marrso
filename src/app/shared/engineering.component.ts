import { LucideArrowUpRight } from '@lucide/angular';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
@Component({
  imports: [LucideArrowUpRight],
  selector: 'app-engineering',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <section class="section engineering">
    <div class="site-container">
      <div class="section-head">
        <div>
          <p class="eyebrow">INGENIERÍA EN PERSPECTIVA</p>
          <h2 class="h2">
            Cada capa cumple una función.<br />Conoce cómo <span>se conectan.</span>
          </h2>
        </div>
        <p>
          Explora las capas de una arquitectura conceptual. Cada pieza tiene una responsabilidad.
          Juntas, hacen que el sistema funcione.
        </p>
      </div>
      <div class="architecture">
        <div class="architecture-toolbar mono">
          <span>MARRSO / EXPLORADOR DE ARQUITECTURA</span><span>MODELO CONCEPTUAL</span>
        </div>
        <div class="architecture-body">
          <div class="layer-list" aria-label="Capas de la arquitectura">
            @for (layer of layers; track layer.name; let i = $index) {
              <button (click)="selected.set(i)" [attr.aria-pressed]="selected() === i">
                <span class="mono">0{{ i + 1 }}</span
                ><span>{{ layer.name }}</span
                ><span aria-hidden="true"
                  ><svg lucideArrowUpRight class="ui-icon" aria-hidden="true"></svg
                ></span>
              </button>
            }
          </div>
          <div class="layer-detail" aria-live="polite">
            <div class="layer-diagram" aria-hidden="true">
              <div>ENTRADA</div>
              <i></i>
              <div class="core">M / CORE</div>
              <i></i>
              <div>EXPERIENCIA</div>
            </div>
            <p class="eyebrow">{{ active().label }}</p>
            <h3>{{ active().title }}</h3>
            <p>{{ active().text }}</p>
            <div class="layer-tags">
              @for (tag of active().tags; track $index) {
                <span>{{ tag }}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`,
  styles: `
    .engineering {
      background: var(--surface);
    }
    .h2 span {
      color: var(--indigo);
    }
    .architecture {
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      background: var(--surface-elevated);
    }
    .architecture-toolbar {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      font-size: 0.75rem;
      color: var(--muted);
      padding: 18px 24px;
      border-bottom: 1px solid var(--border);
    }
    .architecture-toolbar > span:last-child {
      color: var(--indigo);
    }
    .architecture-body {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
    }
    .layer-list {
      padding: 24px;
      border-right: 1px solid var(--border);
      display: grid;
      align-content: center;
      gap: 10px;
    }
    .layer-list button {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 18px;
      background: var(--surface);
      border: 1px solid var(--border-subtle);
      border-radius: 7px;
      color: var(--secondary);
      text-align: left;
      font-size: 1rem;
    }
    .layer-list button > .mono {
      font-size: 0.75rem;
      color: var(--muted);
    }
    .layer-list button > span:last-child {
      margin-left: auto;
    }
    .layer-list button[aria-pressed='true'] {
      border-color: var(--accent-soft);
      background: var(--accent-soft);
      color: var(--lime);
    }
    .layer-detail {
      padding: 42px;
      min-height: 360px;
    }
    .layer-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 40px;
      font: 0.75rem var(--font-mono);
      color: var(--muted);
    }
    .layer-diagram div {
      border: 1px solid var(--border);
      border-radius: 5px;
      padding: 13px 10px;
      white-space: nowrap;
    }
    .layer-diagram .core {
      color: var(--lime);
      border-color: var(--accent-soft);
    }
    .layer-diagram i {
      height: 1px;
      flex: 1;
      max-width: 60px;
      background: linear-gradient(90deg, var(--accent-soft), var(--indigo));
    }
    .layer-detail h3 {
      font-size: 1.6875rem;
      font-weight: 500;
      letter-spacing: -0.04em;
    }
    .layer-detail > p:not(.eyebrow) {
      color: var(--secondary);
      font-size: 0.875rem;
      line-height: 1.8;
      max-width: 450px;
    }
    .layer-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 25px;
    }
    .layer-tags span {
      font: 0.75rem var(--font-mono);
      border: 1px solid var(--border);
      padding: 6px 9px;
      border-radius: 4px;
      color: var(--secondary);
    }
    @media (max-width: 700px) {
      .architecture-body {
        grid-template-columns: 1fr;
      }
      .layer-list {
        border-right: 0;
        border-bottom: 1px solid var(--border);
        padding: 16px;
      }
      .layer-list button {
        padding: 14px;
      }
      .layer-detail {
        padding: 24px;
        min-height: 350px;
      }
      .architecture-toolbar {
        font-size: 0.75rem;
        padding: 15px;
      }
      .architecture-toolbar > span:last-child {
        max-width: 120px;
      }
    }
  `,
})
export class EngineeringComponent {
  readonly selected = signal(0);
  readonly layers = [
    {
      name: 'Experiencia de usuario',
      label: 'LA CAPA VISIBLE',
      title: 'Complejidad resuelta en cada interacción.',
      text: 'Interfaces claras, accesibles y rápidas. El punto donde la arquitectura se convierte en una experiencia útil para una persona.',
      tags: ['Angular', 'TypeScript', 'Accesibilidad'],
    },
    {
      name: 'Servicios e integraciones',
      label: 'CONEXIONES CON PROPÓSITO',
      title: 'Sistemas que hablan el mismo idioma.',
      text: 'Servicios con responsabilidades definidas y APIs que conectan datos, procesos y aplicaciones sin perder el control de la lógica del negocio.',
      tags: ['APIs', 'Contratos', 'Orquestación'],
    },
    {
      name: 'Inteligencia artificial',
      label: 'CONTEXTO ANTES DE RESPONDER',
      title: 'Inteligencia conectada con el negocio.',
      text: 'Una capa que combina contexto, recuperación de información y herramientas. Su alcance y sus límites se definen para cada caso de uso.',
      tags: ['RAG', 'Agentes', 'Búsqueda semántica'],
    },
    {
      name: 'Datos e infraestructura',
      label: 'LA BASE DEL SISTEMA',
      title: 'Diseñada para sostener lo que viene.',
      text: 'Datos organizados, despliegues reproducibles y observabilidad para entender el comportamiento de la plataforma y acompañar su evolución.',
      tags: ['Docker', 'Cloud', 'Observabilidad'],
    },
  ];
  readonly active = computed(() => this.layers[this.selected()]);
}
