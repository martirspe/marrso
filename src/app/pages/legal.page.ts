import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteShellComponent } from '../shared/site-shell.component';
@Component({
  standalone: true,
  imports: [SiteShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-site-shell
    ><main id="contenido" class="site-container legal-page">
      <p class="eyebrow">LEGAL</p>
      <h1 class="display">{{ title() }}</h1>
      <p class="lede">Esta página establece el marco informativo del sitio web de MARRSO S.A.C.</p>
      <section>
        <h2>Alcance</h2>
        <p>
          La información publicada tiene carácter corporativo e informativo. Los servicios, alcances
          y condiciones aplicables se definen en acuerdos específicos con cada cliente.
        </p>
        <h2>Datos personales</h2>
        <p>
          El formulario utiliza los datos que escribes para generar un archivo en tu dispositivo. No
          envía la consulta a MARRSO. Evita incluir información sensible y guarda el archivo en un
          lugar seguro.
        </p>
        <h2>Actualizaciones</h2>
        <p>
          Este contenido podrá actualizarse cuando cambien los procesos o la normativa aplicable.
        </p>
      </section>
    </main></app-site-shell
  >`,
  styles: `
    .legal-page {
      padding: 7rem 0;
      max-width: 850px;
    }
    .legal-page section {
      margin-top: 4rem;
      color: var(--secondary);
      line-height: 1.7;
    }
    .legal-page h2 {
      color: var(--text);
      margin-top: 2.5rem;
    }
  `,
})
export class LegalPage {
  private route = inject(ActivatedRoute);
  readonly title = computed(() =>
    this.route.snapshot.data['page'] === 'terminos'
      ? 'Términos y condiciones'
      : 'Política de privacidad',
  );
}
