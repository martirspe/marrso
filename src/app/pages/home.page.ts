import { LucidePlus, LucideSparkles } from '@lucide/angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteShellComponent } from '../shared/site-shell.component';
import { HeroComponent } from '../shared/hero.component';
import { EcosystemComponent } from '../shared/ecosystem.component';
import { EngineeringComponent } from '../shared/engineering.component';
@Component({
  imports: [
    LucidePlus,
    LucideSparkles,
    RouterLink,
    SiteShellComponent,
    HeroComponent,
    EcosystemComponent,
    EngineeringComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  readonly steps = [
    {
      n: '01',
      name: 'Descubrimiento',
      text: 'Primero, el problema correcto. Entendemos tu negocio, tus usuarios y los límites del sistema.',
      output: 'Contexto y prioridades',
    },
    {
      n: '02',
      name: 'Arquitectura',
      text: 'Convertimos el objetivo en una estructura clara de datos, servicios e integraciones.',
      output: 'Diseño y alcance',
    },
    {
      n: '03',
      name: 'Ingeniería',
      text: 'Construimos, probamos e integramos. Cada entrega acerca el sistema a sus usuarios.',
      output: 'Software funcional',
    },
    {
      n: '04',
      name: 'Despliegue',
      text: 'Preparamos la infraestructura, la entrega y la observabilidad para operar.',
      output: 'Puesta en producción',
    },
    {
      n: '05',
      name: 'Evolución',
      text: 'Aprendemos del uso real. Mejoramos el producto y su base técnica.',
      output: 'Mejora continua',
    },
  ];
  readonly faqs = [
    {
      q: '¿Cómo se define el presupuesto?',
      a: 'El presupuesto depende del alcance, las integraciones y las condiciones del sistema actual. La propuesta distingue el trabajo de implementación de los servicios recurrentes y costos de terceros que correspondan. Primero definimos qué necesitas resolver y qué incluye cada entrega.',
    },
    {
      q: '¿Necesito tener todos los requisitos definidos?',
      a: 'Puedes empezar describiendo tu operación actual, el problema y el resultado que buscas. Si faltan definiciones, acordamos el trabajo de descubrimiento necesario antes de estimar el desarrollo.',
    },
    {
      q: '¿Por dónde empezamos?',
      a: 'Por una conversación sobre el problema, los usuarios y los objetivos. A partir de ese contexto definimos las siguientes decisiones técnicas, el alcance y una propuesta de trabajo.',
    },
    {
      q: '¿Pueden trabajar sobre un sistema existente?',
      a: 'Sí. El primer paso es revisar su arquitectura, integraciones y restricciones. Esa evaluación permite decidir qué conservar, qué mejorar y cómo introducir cambios de forma gradual.',
    },
    {
      q: '¿Todos los proyectos necesitan inteligencia artificial?',
      a: 'No. Aplicamos IA cuando aporta valor al problema. Si una integración o un proceso más sencillo resuelve la necesidad, esa puede ser la mejor decisión.',
    },
    {
      q: '¿Qué pasa después del lanzamiento?',
      a: 'Definimos contigo la documentación, la transferencia y el acompañamiento que requiere el sistema. La operación y evolución se acuerdan según el alcance de cada proyecto.',
    },
  ];
}
