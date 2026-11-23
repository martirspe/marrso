import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-orbit-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="orbital-art" [class.quiet]="paused()" aria-hidden="true">
    <div class="halo"></div>
    <svg viewBox="0 0 700 700" focusable="false">
      <defs>
        <linearGradient id="spectral" x1="0" y1="0" x2="1" y2=".9">
          <stop stop-color="var(--accent)" />
          <stop offset=".38" stop-color="var(--accent)" />
          <stop offset=".68" stop-color="var(--indigo)" />
          <stop offset="1" stop-color="var(--indigo)" />
        </linearGradient>
        <radialGradient id="core">
          <stop stop-color="var(--accent)" stop-opacity=".19" />
          <stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="350" cy="350" r="285" fill="url(#core)" />
      <g class="scaffold" fill="none" stroke="var(--border)">
        <circle cx="350" cy="350" r="300" />
        <circle cx="350" cy="350" r="320" stroke-dasharray="1 12" />
        <path d="M350 15V58M350 642V685M15 350H58M642 350H685" />
      </g>
      <g class="geometry" fill="none" stroke="url(#spectral)" stroke-width=".8">
        @for (path of paths; track $index) {
          <path [attr.d]="path" />
        }
      </g>
      <g class="satellites">
        <circle cx="350" cy="50" r="4" fill="var(--accent)" />
        <circle cx="650" cy="350" r="3" fill="var(--indigo)" />
        <circle cx="350" cy="650" r="3" fill="var(--accent)" />
      </g>
    </svg>
    <div class="core-mark">
      <span>m<span class="accent">.</span></span
      ><small>ENGINEERED BY MARRSO</small>
    </div>
  </div>`,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .orbital-art {
      position: relative;
      aspect-ratio: 1;
      isolation: isolate;
    }
    .halo {
      position: absolute;
      inset: 12%;
      border-radius: 50%;
      background:
        radial-gradient(ellipse at 25% 25%, var(--accent-soft), transparent 60%),
        radial-gradient(ellipse at 75% 70%, var(--violet-soft), transparent 62%);
      filter: blur(35px);
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .geometry {
      transform-origin: 350px 350px;
      animation: breathe 16s ease-in-out infinite alternate;
    }
    .satellites {
      transform-origin: 350px 350px;
      animation: orbit 40s linear infinite;
    }
    .core-mark {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .core-mark > span {
      font-size: 4.5rem;
      letter-spacing: -0.12em;
      font-weight: 600;
      line-height: 1;
    }
    .accent {
      color: var(--lime);
    }
    small {
      font: 0.75rem var(--font-mono);
      letter-spacing: 0.16em;
      margin-top: 18px;
      color: var(--muted);
    }
    .quiet * {
      animation-play-state: paused !important;
    }
    @keyframes breathe {
      from {
        transform: rotate(-12deg) scale(0.94);
      }
      to {
        transform: rotate(12deg) scale(1.02);
      }
    }
    @keyframes orbit {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class OrbitArtComponent {
  readonly paused = input(false);
  readonly paths = Array.from({ length: 36 }, (_, i) => {
    const phase = (i * Math.PI * 2) / 36;
    return (
      Array.from({ length: 121 }, (_, j) => {
        const t = (j * Math.PI * 2) / 120;
        const radius = 186 + 65 * Math.cos(t * 3 + phase);
        const x = 350 + radius * Math.cos(t);
        const y = 350 + radius * Math.sin(t) * 0.86 + 54 * Math.sin(t * 3 + phase);
        return (j ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2);
      }).join(' ') + 'Z'
    );
  });
}
