import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.page').then((m) => m.HomePage),
    title: 'Desarrollo de software e inteligencia artificial en Perú — MARRSO',
  },
  {
    path: 'ecosistema',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'ecosistema' },
    title: 'Productos digitales y plataformas del ecosistema — MARRSO',
  },
  {
    path: 'servicios',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'servicios' },
    title: 'Desarrollo de software, IA, diseño web y branding — MARRSO',
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'nosotros' },
    title: 'Estudio de software e IA aplicada en Perú — MARRSO',
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'proyectos' },
    title: 'Proyectos de software, IA y cloud — MARRSO',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact.page').then((m) => m.ContactPage),
    title: 'Contacto para tu proyecto digital — MARRSO',
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/legal.page').then((m) => m.LegalPage),
    data: { page: 'privacidad' },
    title: 'Política de privacidad — MARRSO',
  },
  {
    path: 'terminos',
    loadComponent: () => import('./pages/legal.page').then((m) => m.LegalPage),
    data: { page: 'terminos' },
    title: 'Términos y condiciones — MARRSO',
  },
  { path: '**', redirectTo: '' },
];
