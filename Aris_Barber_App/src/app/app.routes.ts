import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { S } from '@angular/cdk/keycodes';
import { Servicios } from './components/servicios/servicios';
import { Clientes } from './components/clientes/clientes';
import { Citas } from './components/citas/citas';
import { Login } from './components/login/login';
import { GestionCitas } from './components/gestion-citas/gestion-citas';
import { BloqueoBarbero } from './components/bloqueo-barbero/bloqueo-barbero';
import { authGuard } from './shared/helpers/guards';
import { Role } from './shared/Models/Role';


export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home',component: Home},
    {path: 'servicios',component: Servicios,
        canActivate: [authGuard],
        data:{roles: [Role.Barbero]}
    },
    {path: 'cliente', component: Clientes},
    {path: 'citas', component: Citas},
    {path: 'login', component: Login},
    {path: 'citasdeldia', component: GestionCitas,
         canActivate: [authGuard],
        data:{roles: [Role.Barbero]}
    },
    {path: 'bloquearHorarios', component: BloqueoBarbero,
         canActivate: [authGuard],
        data:{roles: [Role.Barbero]}
     },
  
];
