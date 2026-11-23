import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.page').then((m) => m.HomePage),
    title: 'MARRSO — Software, IA e infraestructura cloud',
  },
  {
    path: 'ecosistema',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'ecosistema' },
    title: 'Ecosistema | MARRSO',
  },
  {
    path: 'servicios',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'servicios' },
    title: 'Servicios | MARRSO',
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'nosotros' },
    title: 'Nosotros | MARRSO',
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./pages/content.page').then((m) => m.ContentPage),
    data: { page: 'proyectos' },
    title: 'Proyectos | MARRSO',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact.page').then((m) => m.ContactPage),
    title: 'Contacto | MARRSO',
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/legal.page').then((m) => m.LegalPage),
    data: { page: 'privacidad' },
    title: 'Política de privacidad | MARRSO',
  },
  {
    path: 'terminos',
    loadComponent: () => import('./pages/legal.page').then((m) => m.LegalPage),
    data: { page: 'terminos' },
    title: 'Términos y condiciones | MARRSO',
  },
  { path: '**', redirectTo: '' },
];
