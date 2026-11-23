import { LucideDownload } from '@lucide/angular';
import { ChangeDetectionStrategy, Component, signal, afterNextRender } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServiceSelectComponent } from '../shared/service-select.component';
import { SiteShellComponent } from '../shared/site-shell.component';
@Component({
  imports: [
    ServiceSelectComponent,
    LucideDownload,
    SiteShellComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-site-shell
    ><main id="contenido" class="site-container contact-page">
      <div class="contact-intro">
        <p class="eyebrow">CONSTRUYAMOS LO QUE SIGUE</p>
        <h1 class="display">Dale forma<br />a tu <span>proyecto.</span></h1>
        <p class="lede">
          Organiza lo que necesitas desarrollar, integrar o mejorar. Este formulario te ayuda a
          preparar un resumen para una futura conversación sobre tu proyecto.
        </p>
        <div class="contact-points">
          <p><span>01</span> Tu negocio y sus objetivos.</p>
          <p><span>02</span> El desafío que quieres resolver.</p>
          <p><span>03</span> El resultado que necesitas conseguir.</p>
        </div>
        <div class="contact-note">
          <span class="eyebrow">PREPARA TU PROYECTO</span>
          <p>
            El envío en línea todavía no está disponible. Puedes preparar y descargar tu consulta.
            La información permanece en tu navegador y no se envía a MARRSO.
          </p>
        </div>
      </div>
      <div class="form-panel">
        <p class="mono form-title">M / CUÉNTANOS TU PROYECTO</p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label
            >Nombre completo<input
              formControlName="name"
              autocomplete="name"
              maxlength="120"
              required
              [attr.aria-invalid]="invalid('name')"
              aria-describedby="name-error"
            />
            @if (invalid('name')) {
              <small id="name-error" class="error">Escribe tu nombre completo.</small>
            }
          </label>
          <label
            >Correo electrónico<input
              formControlName="email"
              type="email"
              autocomplete="email"
              maxlength="254"
              required
              [attr.aria-invalid]="invalid('email')"
              aria-describedby="email-error"
            />
            @if (invalid('email')) {
              <small id="email-error" class="error">Escribe un correo válido.</small>
            }
          </label>
          <label
            >Empresa <span class="optional">(opcional)</span
            ><input formControlName="company" autocomplete="organization" maxlength="160"
          /></label>
          <app-service-select [control]="form.controls.service" [invalid]="invalid('service')" />
          <label class="wide"
            >¿Qué necesitas resolver?<textarea
              formControlName="message"
              rows="5"
              maxlength="4000"
              required
              [attr.aria-invalid]="invalid('message')"
              aria-describedby="message-error"
            ></textarea>
            @if (invalid('message')) {
              <small id="message-error" class="error"
                >Cuéntanos el contexto en al menos 20 caracteres.</small
              >
            }
          </label>
          <label class="check wide"
            ><input formControlName="privacy" type="checkbox" required /><span
              >He leído la <a routerLink="/privacidad">política de privacidad</a>.</span
            ></label
          >
          @if (invalid('privacy')) {
            <p class="error wide">Confirma que has leído la política de privacidad.</p>
          }
          <button class="button primary wide" type="submit" [disabled]="!ready()">
            Descargar resumen del proyecto
            <span aria-hidden="true"
              ><svg lucideDownload class="ui-icon" aria-hidden="true"></svg
            ></span>
          </button>
          <p class="form-status wide" role="status">{{ status() }}</p>
        </form>
      </div>
    </main></app-site-shell
  >`,
  styles: `
    .contact-page {
      padding: 90px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 70px;
      align-items: start;
    }
    .contact-intro .display {
      font-size: clamp(50px, 5.5vw, 78px);
    }
    .contact-intro h1 span {
      color: var(--lime);
    }
    .contact-intro .lede {
      font-size: 1rem;
    }
    .contact-points {
      margin: 38px 0;
    }
    .contact-points p {
      font-size: 0.875rem;
      color: var(--secondary);
      padding: 14px 0;
      border-bottom: 1px solid var(--border-subtle);
      margin: 0;
    }
    .contact-points span {
      font: 0.75rem var(--font-mono);
      color: var(--lime);
      margin-right: 18px;
    }
    .contact-note {
      border-left: 1px solid var(--lime);
      padding-left: 20px;
      max-width: 390px;
    }
    .contact-note .eyebrow {
      font-size: 0.875rem;
    }
    .contact-note p {
      font-size: 0.875rem;
      line-height: 1.8;
      color: var(--secondary);
      margin: 12px 0 0;
    }
    .form-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 30px;
    }
    .form-title {
      font-size: 0.75rem;
      color: var(--muted);
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border);
      padding-bottom: 22px;
      margin-bottom: 25px;
    }
    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px 18px;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 9px;
      color: var(--secondary);
      font-size: 0.75rem;
      min-width: 0;
    }
    .optional {
      font-size: 0.75rem;
      display: contents;
    }
    input,
    select,
    textarea {
      width: 100%;
      background: var(--background);
      border: 1px solid var(--input);
      border-radius: 6px;
      padding: 12px;
      color: var(--text);
      min-width: 0;
      font-size: 0.875rem;
      resize: vertical;
    }
    input:focus,
    select:focus,
    textarea:focus {
      border-color: var(--lime);
    }
    input[aria-invalid='true'],
    select[aria-invalid='true'],
    textarea[aria-invalid='true'] {
      border-color: var(--destructive);
    }
    .wide {
      grid-column: span 2;
    }
    .check {
      flex-direction: row;
      align-items: center;
      line-height: 1.6;
    }
    .check input {
      width: 16px;
      height: 16px;
      accent-color: var(--lime);
      flex-shrink: 0;
    }
    .check a {
      color: var(--text);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .error {
      color: var(--destructive);
      font-size: 0.75rem;
      line-height: 1.5;
      margin: 0;
    }
    .form-status {
      font-size: 0.75rem;
      line-height: 1.6;
      color: var(--secondary);
      margin: 0;
    }
    .form-status:empty {
      display: none;
    }
    @media (max-width: 900px) {
      .contact-page {
        grid-template-columns: 1fr;
        gap: 40px;
        padding: 55px 0;
      }
      .contact-intro .display {
        font-size: clamp(46px, 8vw, 70px);
      }
    }
    @media (max-width: 450px) {
      form {
        grid-template-columns: 1fr;
      }
      .wide {
        grid-column: auto;
      }
      .form-panel {
        padding: 22px;
      }
      .button {
        font-size: 0.875rem;
      }
    }
  `,
})
export class ContactPage {
  readonly ready = signal(false);
  constructor() {
    afterNextRender(() => this.ready.set(true));
  }
  readonly status = signal('');
  readonly attempted = signal(false);
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(120)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    company: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] }),
    service: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(4000)],
    }),
    privacy: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
  invalid(field: keyof ContactPage['form']['controls']): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.attempted());
  }
  submit(): void {
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.status.set('Revisa los campos indicados antes de descargar el resumen.');
      return;
    }
    const value = this.form.getRawValue();
    const text = [
      'CONSULTA DE PROYECTO — MARRSO',
      'Este resumen se guardó localmente. No se ha enviado a MARRSO.',
      '',
      'Nombre: ' + value.name.trim(),
      'Correo: ' + value.email.trim(),
      'Empresa: ' + value.company.trim(),
      'Servicio: ' + value.service,
      '',
      'CONTEXTO DEL PROYECTO',
      value.message.trim(),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'consulta-marrso.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.status.set('Resumen preparado para descargar. No se ha enviado a MARRSO.');
  }
}
