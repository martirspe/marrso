import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  template:
    '<a class="skip-link" href="#contenido">Saltar al contenido principal</a><router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
