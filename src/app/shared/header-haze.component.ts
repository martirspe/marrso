import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'app-header-haze',
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span></span><span></span><span></span><span></span>',
  styles: `
    :host {
      position: absolute;
      inset: 0 0 -40px;
      pointer-events: none;
      opacity: 1;
    }
    :host::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        var(--background),
        color-mix(in srgb, var(--background) 92%, transparent) 40%,
        color-mix(in srgb, var(--background) 55%, transparent) 65%,
        transparent
      );
    }
    :host span {
      position: absolute;
      inset: 0;
      backdrop-filter: blur(var(--blur));
      -webkit-backdrop-filter: blur(var(--blur));
      mask-image: linear-gradient(
        to bottom,
        #000 var(--solid),
        #0009 var(--fade),
        transparent var(--end)
      );
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 var(--solid),
        #0009 var(--fade),
        transparent var(--end)
      );
    }
    :host span:nth-child(1) {
      --blur: 1px;
      --solid: 55%;
      --fade: 78%;
      --end: 100%;
    }
    :host span:nth-child(2) {
      --blur: 3px;
      --solid: 45%;
      --fade: 68%;
      --end: 90%;
    }
    :host span:nth-child(3) {
      --blur: 8px;
      --solid: 35%;
      --fade: 58%;
      --end: 80%;
    }
    :host span:nth-child(4) {
      --blur: 16px;
      --solid: 25%;
      --fade: 48%;
      --end: 70%;
    }
  `,
})
export class HeaderHazeComponent {}
