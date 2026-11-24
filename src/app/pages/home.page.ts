import {
  LucidePlus,
  LucideFileText,
  LucideDynamicIcon,
  LucideSearch,
  LucideLayers,
  LucideCodeXml,
  LucideRocket,
  LucideRefreshCw,
} from '@lucide/angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteShellComponent } from '../shared/site-shell.component';
import { HeroComponent } from '../shared/hero.component';
import { PRODUCTS } from '../shared/product-catalog';

@Component({
  imports: [
    LucidePlus,
    LucideFileText,
    LucideDynamicIcon,
    RouterLink,
    SiteShellComponent,
    HeroComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  readonly featuredProducts = PRODUCTS.filter(
    (product) => product.id === 'aloja' || product.id === 'habix',
  );
  readonly serviceGroups = [
    {
      title: 'Operación y tecnología',
      description: 'Para conectar herramientas, ordenar procesos y desarrollar tu producto.',
      items: [
        {
          id: 'software',
          name: 'Ingeniería de software',
          description: 'Aplicaciones e integraciones adaptadas a tu operación.',
        },
        {
          id: 'inteligencia-artificial',
          name: 'Inteligencia artificial',
          description: 'Asistentes y búsquedas conectados con tus datos.',
        },
        {
          id: 'cloud',
          name: 'Cloud & DevOps',
          description: 'Infraestructura, despliegues y monitoreo de tus sistemas.',
        },
        {
          id: 'automatizacion',
          name: 'Automatización e integración',
          description: 'Herramientas conectadas para reducir tareas repetitivas.',
        },
      ],
    },
    {
      title: 'Marca y experiencia digital',
      description: 'Para presentar tu oferta y facilitar el siguiente paso de tus clientes.',
      items: [
        {
          id: 'diseno-web',
          name: 'Diseño y desarrollo web',
          description: 'Webs y tiendas online con recorridos claros y conexiones útiles.',
        },
        {
          id: 'branding',
          name: 'Branding e identidad visual',
          description: 'Una identidad coherente en tu web y tus materiales comerciales.',
        },
      ],
    },
  ];
  readonly steps = [
    {
      n: '01',
      icon: LucideSearch,
      name: 'Descubrimiento',
      text: 'Entendemos tu negocio, tus clientes y tu operación. Definimos el problema, las prioridades y lo que necesitas conseguir.',
      output: 'Contexto y prioridades',
    },
    {
      n: '02',
      icon: LucideLayers,
      name: 'Diseño y arquitectura',
      text: 'Damos estructura a la solución: identidad, experiencia de uso y base técnica, según las necesidades del proyecto.',
      output: 'Diseño y alcance',
    },
    {
      n: '03',
      icon: LucideCodeXml,
      name: 'Construcción',
      text: 'Diseñamos, desarrollamos y probamos las piezas acordadas. Las integramos para que respondan al mismo objetivo.',
      output: 'Entregables conectados',
    },
    {
      n: '04',
      icon: LucideRocket,
      name: 'Puesta en marcha',
      text: 'Preparamos la entrega y, cuando corresponde, la infraestructura, el despliegue y el monitoreo para operar.',
      output: 'Solución lista para su uso',
    },
    {
      n: '05',
      icon: LucideRefreshCw,
      name: 'Evolución',
      text: 'Definimos la documentación y la transferencia. Acordamos el acompañamiento y las mejoras según el uso y tus prioridades.',
      output: 'Continuidad acordada',
    },
  ];
  readonly faqs = [
    {
      q: '¿Puedo contratar solo branding o una web?',
      a: 'Sí. Puedes trabajar tu identidad de marca, tu web o tu software por separado. Si necesitas conectarlos, definimos una propuesta conjunta con entregables y prioridades. Si ya tienes una identidad o herramientas en uso, partimos de esa base.',
    },
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
