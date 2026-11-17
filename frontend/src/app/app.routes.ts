import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Catalogo } from './pages/catalogo/catalogo';
import { Nosotros } from './pages/nosotros/nosotros';
import { Contacto } from './pages/contacto/contacto';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Carrito } from './pages/carrito/carrito';
import { Favoritos } from './pages/favoritos/favoritos';
import { Cuenta } from './pages/cuenta/cuenta';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Café Aurora · Inicio' },
  { path: 'menu', component: Menu, title: 'Café Aurora · Menú' },
  { path: 'catalogo', component: Catalogo, title: 'Café Aurora · Catálogo' },
  { path: 'nosotros', component: Nosotros, title: 'Café Aurora · Nosotros' },
  { path: 'contacto', component: Contacto, title: 'Café Aurora · Contacto' },
  { path: 'login', component: Login, title: 'Café Aurora · Iniciar sesión' },
  { path: 'registro', component: Registro, title: 'Café Aurora · Crear cuenta' },
  { path: 'carrito', component: Carrito, title: 'Café Aurora · Carrito', canActivate: [authGuard] },
  { path: 'favoritos', component: Favoritos, title: 'Café Aurora · Favoritos', canActivate: [authGuard] },
  { path: 'cuenta', component: Cuenta, title: 'Café Aurora · Mi cuenta', canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
