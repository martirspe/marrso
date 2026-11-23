import { LucideSparkles, LucideCodeXml, LucideLayers } from '@lucide/angular';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrbitArtComponent } from './orbit-art.component';
@Component({
  selector: 'app-hero',
  imports: [LucideSparkles, LucideCodeXml, LucideLayers, RouterLink, OrbitArtComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  readonly paused = signal(false);
}
