import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteShellComponent } from '../shared/site-shell.component';
@Component({
  standalone: true,
  imports: [SiteShellComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-site-shell
    ><main tabindex="-1" id="contenido" class="site-container legal-page">
      <nav class="legal-nav" aria-label="Información legal">
        <a
          routerLink="/privacidad"
          [attr.aria-current]="data()['page'] === 'privacidad' ? 'page' : null"
          >Privacidad</a
        ><a
          routerLink="/terminos"
          [attr.aria-current]="data()['page'] === 'terminos' ? 'page' : null"
          >Términos y condiciones</a
        >
      </nav>
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
          MARRSO S.A.C. recibe el nombre, correo, empresa (si la indicas), servicio y mensaje que
          envías mediante el formulario para atender tu consulta y responderte. El envío se realiza
          mediante un proveedor de correo transaccional. Evita incluir información sensible. Puedes
          solicitar información sobre tus datos o su eliminación respondiendo al correo de MARRSO.
        </p>
        <h2>Actualizaciones</h2>
        <p>
          Este contenido podrá actualizarse cuando cambien los procesos o la normativa aplicable.
        </p>
        @if (data()['page'] === 'privacidad') {
          <h2 id="cookies">Cookies y almacenamiento local</h2>
          <p>
            Guardamos tu decisión sobre cookies durante 180 días en una cookie propia y en el
            almacenamiento local de este navegador. La preferencia de apariencia también puede
            guardarse localmente. Puedes modificar tu decisión en cualquier momento desde
            «Preferencias de cookies» en el pie del sitio.
          </p>
          <p>
            Las categorías opcionales son analítica (Google Analytics 4) y publicidad (Meta Pixel,
            Meta Conversions API y TikTok Pixel). Con tu autorización publicitaria, Meta puede
            recibir visitas y, si envías el formulario, el evento de consulta recibida junto con una
            huella SHA-256 de tu correo normalizado, dirección IP, agente del navegador e
            identificadores publicitarios de Meta disponibles. El mensaje del formulario no se
            comparte con Meta. Los proveedores solo se activan cuando están configurados y
            autorizados. Al retirar la autorización publicitaria, el sitio se recarga para detener
            los píxeles ya cargados. También puedes borrar estos datos desde la configuración de tu
            navegador.
          </p>
        }
      </section>
    </main></app-site-shell
  >`,
  styles: `
    .legal-page {
      padding: clamp(2rem, 6vw, 5rem) 0;
      max-width: 850px;
    }
    .legal-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 24px;
      margin-bottom: 32px;
      font-size: 0.875rem;
    }
    .legal-nav a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      text-decoration: underline;
      text-underline-offset: 5px;
    }
    .legal-nav [aria-current] {
      color: var(--accent);
      font-weight: 600;
    }
    .display {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      text-wrap: balance;
    }
    .legal-page section {
      margin-top: 4rem;
      color: var(--secondary);
      line-height: 1.7;
    }
    .legal-page h2 {
      color: var(--text);
      margin-top: 2.5rem;
      margin-bottom: 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.3;
    }
  `,
})
export class LegalPage {
  private route = inject(ActivatedRoute);
  readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  readonly title = computed(() =>
    this.data()['page'] === 'terminos' ? 'Términos y condiciones' : 'Política de privacidad',
  );
}
