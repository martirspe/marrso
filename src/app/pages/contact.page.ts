import { LucideSend } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  afterNextRender,
  ElementRef,
  inject,
  afterRenderEffect,
} from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServiceSelectComponent } from '../shared/service-select.component';
import { SiteShellComponent } from '../shared/site-shell.component';
import { TrackingService } from '../shared/tracking.service';
@Component({
  imports: [
    ServiceSelectComponent,
    LucideSend,
    SiteShellComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-site-shell
    ><main tabindex="-1" id="contenido" class="site-container contact-page">
      <div class="contact-intro">
        <p class="eyebrow">CONSTRUYAMOS LO QUE SIGUE</p>
        <h1 class="display">Dale forma<br />a tu <span>proyecto.</span></h1>
        <p class="lede">
          Cuéntanos qué necesitas desarrollar, integrar o mejorar. Revisaremos tu consulta y te
          responderemos por correo.
        </p>
        <div class="contact-points">
          <p><span>01</span> Tu negocio y sus objetivos.</p>
          <p><span>02</span> El desafío que quieres resolver.</p>
          <p><span>03</span> El resultado que necesitas conseguir.</p>
        </div>
        <div class="contact-note">
          <span class="eyebrow">HABLEMOS DE TU PROYECTO</span>
          <p>Si prefieres conversar de inmediato, también puedes escribirnos por WhatsApp.</p>
        </div>
      </div>
      <div class="form-panel">
        <h2 class="mono form-title">Cuéntanos tu proyecto</h2>
        <p class="form-help">
          Todos los campos son obligatorios salvo Empresa. Usaremos tus datos para responder esta
          consulta.
        </p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label
            >Nombre completo<input
              formControlName="name"
              autocomplete="name"
              maxlength="120"
              required
              [attr.aria-invalid]="invalid('name')"
              [attr.aria-describedby]="invalid('name') ? 'name-error' : null"
            />
            @if (invalid('name')) {
              <small id="name-error" class="error">Escribe tu nombre completo.</small>
            }
          </label>
          <label
            >Correo electrónico<input
              formControlName="email"
              autocapitalize="none"
              spellcheck="false"
              type="email"
              autocomplete="email"
              maxlength="254"
              required
              [attr.aria-invalid]="invalid('email')"
              [attr.aria-describedby]="invalid('email') ? 'email-error' : null"
            />
            @if (invalid('email')) {
              <small id="email-error" class="error">Escribe un correo válido.</small>
            }
          </label>
          <label
            >Empresa <span class="optional">(opcional)</span
            ><input formControlName="company" autocomplete="organization" maxlength="160"
          /></label>
          <input
            class="honeypot"
            formControlName="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />
          <app-service-select [control]="form.controls.service" [invalid]="invalid('service')" />
          <label class="wide"
            >¿Qué necesitas resolver?<textarea
              formControlName="message"
              rows="5"
              maxlength="4000"
              required
              [attr.aria-invalid]="invalid('message')"
              [attr.aria-describedby]="invalid('message') ? 'message-error' : null"
            ></textarea>
            @if (invalid('message')) {
              <small id="message-error" class="error"
                >Cuéntanos el contexto en al menos 20 caracteres.</small
              >
            }
          </label>
          <label class="check wide"
            ><input
              formControlName="privacy"
              type="checkbox"
              required
              [attr.aria-invalid]="invalid('privacy')"
              [attr.aria-describedby]="invalid('privacy') ? 'privacy-error' : null"
            /><span
              >He leído la <a routerLink="/privacidad">política de privacidad</a>.</span
            ></label
          >
          @if (invalid('privacy')) {
            <p id="privacy-error" class="error wide">
              Confirma que has leído la política de privacidad.
            </p>
          }
          <button class="button primary wide" type="submit" [disabled]="!ready() || sending()">
            {{ sending() ? 'Enviando consulta…' : 'Enviar consulta' }}
            <span aria-hidden="true"
              ><svg lucideSend class="ui-icon" aria-hidden="true"></svg
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
      font-size: 0.875rem;
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
      font-size: 0.875rem;
      min-width: 0;
    }
    .optional {
      font-size: 0.875rem;
      display: contents;
    }
    .honeypot {
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      opacity: 0;
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
      font-size: 1rem;
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
    .form-help {
      color: var(--secondary);
      font-size: 0.875rem;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .check {
      min-height: 44px;
      flex-direction: row;
      align-items: center;
      line-height: 1.6;
    }
    .check input {
      width: 20px;
      height: 20px;
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
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }
    .form-status {
      font-size: 0.875rem;
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
  private readonly tracking = inject(TrackingService);
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly focusInvalid = signal(false);
  private readonly route = inject(ActivatedRoute);
  readonly ready = signal(false);
  readonly sending = signal(false);
  constructor() {
    const service = this.route.snapshot.queryParamMap.get('servicio');
    if (
      service &&
      [
        'Ingeniería de software',
        'Inteligencia artificial',
        'Cloud & DevOps',
        'Automatización e integración',
        'Diseño y desarrollo web',
        'Branding e identidad visual',
      ].includes(service)
    )
      this.form.controls.service.setValue(service);
    afterNextRender(() => this.ready.set(true));
    afterRenderEffect(() => {
      if (!this.focusInvalid()) return;
      const field = Array.from(
        (this.element.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
          '[aria-invalid="true"]',
        ),
      ).find((element) => element.getClientRects().length > 0);
      field?.focus();
      this.focusInvalid.set(false);
    });
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
    website: new FormControl('', { nonNullable: true }),
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
  async submit(): Promise<void> {
    if (this.sending()) return;
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusInvalid.set(true);
      this.status.set('Revisa los campos indicados antes de enviar la consulta.');
      return;
    }
    const value = this.form.getRawValue();
    this.sending.set(true);
    this.status.set('Enviando tu consulta…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      if (!response.ok) throw new Error('send_failed');
      const result: { metaEventId?: string } = await response.json();
      if (result.metaEventId) this.tracking.trackLead(result.metaEventId);
      this.form.reset();
      this.attempted.set(false);
      this.status.set('Consulta enviada. Te responderemos por correo.');
    } catch {
      this.status.set(
        'No pudimos enviar tu consulta. Inténtalo de nuevo o escríbenos por WhatsApp.',
      );
    } finally {
      this.sending.set(false);
    }
  }
}
