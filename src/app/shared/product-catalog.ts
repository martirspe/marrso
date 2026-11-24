import {
  LucideCloud,
  LucideSparkles,
  LucideHouse,
  LucideFileText,
  LucideMail,
} from '@lucide/angular';
export const PRODUCTS = [
  {
    id: 'aloja',
    name: 'Aloja',
    category: 'Creación web con IA',
    icon: LucideCloud,
    detail: 'Describe la web que quieres crear.',
    audience:
      'Generación de interfaces web con inteligencia artificial a partir de lenguaje natural.',
  },
  {
    id: 'agopify',
    name: 'Agopify',
    category: 'Comercio conversacional',
    icon: LucideSparkles,
    detail: 'Ayuda a encontrar el producto adecuado.',
    audience: 'Inteligencia artificial aplicada a la experiencia de compra.',
  },
  {
    id: 'habix',
    name: 'Habix',
    category: 'Búsqueda inmobiliaria',
    icon: LucideHouse,
    detail: 'Un lugar que encaja contigo.',
    audience: 'Descubrimiento de propiedades con una búsqueda más intuitiva.',
  },
  {
    id: 'reclamo',
    name: 'Reclamo Fácil',
    category: 'Gestión de reclamaciones',
    icon: LucideFileText,
    detail: 'Organiza la atención de reclamaciones.',
    audience: 'Herramientas para organizar y gestionar las reclamaciones de tus clientes.',
  },
];
export const UPCOMING = [
  { id: 'zendix', name: 'Zendix', category: 'Email marketing', icon: LucideMail },
  {
    id: 'cotizaflow',
    name: 'CotizaFlow',
    category: 'Propuestas comerciales',
    icon: LucideFileText,
  },
];
