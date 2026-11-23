import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideDynamicIcon,
  LucideSparkles,
  LucideCode2,
  LucideCloud,
  LucideBookOpen,
} from '@lucide/angular';
import { PRODUCTS, UPCOMING } from './product-catalog';
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, LucideDynamicIcon, LucideSparkles, LucideBookOpen],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
  readonly products = PRODUCTS;
  readonly upcoming = UPCOMING;
  readonly intents = [
    {
      name: 'Crear un producto',
      description: 'De la idea al software.',
      route: '/servicios',
      fragment: 'software',
      icon: LucideCode2,
    },
    {
      name: 'Integrar IA',
      description: 'Asistentes y búsquedas con tus datos.',
      route: '/servicios',
      fragment: 'inteligencia-artificial',
      icon: LucideSparkles,
    },
    {
      name: 'Crear una web con IA',
      description: 'Describe tu idea con tus palabras.',
      route: '/ecosistema',
      fragment: 'aloja',
      icon: LucideCloud,
    },
  ];
}
