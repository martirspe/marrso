import {
  LucideCloud,
  LucideMail,
  LucideFileText,
  LucideServer,
  LucideTrendingUp,
  LucideSparkles,
  LucideHouse,
  LucideSearch,
  LucideArrowUpRight,
  LucideLayers,
} from '@lucide/angular';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-ecosystem',
  imports: [
    LucideCloud,
    LucideMail,
    LucideFileText,
    LucideServer,
    LucideTrendingUp,
    LucideSparkles,
    LucideHouse,
    LucideSearch,
    LucideArrowUpRight,
    LucideLayers,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ecosystem.component.html',
  styleUrl: './ecosystem.component.css',
})
export class EcosystemComponent {
  readonly category = signal<'casual' | 'deportivo'>('casual');
  readonly property = signal(false);
  readonly bars = [
    24, 38, 33, 58, 45, 62, 52, 72, 48, 82, 63, 78, 69, 88, 62, 76, 95, 74, 88, 81, 91, 78, 97, 85,
  ];
}
