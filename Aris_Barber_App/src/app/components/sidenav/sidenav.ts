import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/authServices';

type MenuItem= {
  icon : string;
  label : string;
  route : string;
  rol: number[];
}
@Component({
  selector: 'app-sidenav',
  imports: [MatIconModule,MatListModule,RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  srvAuth= inject(AuthService);
menuItem = signal<MenuItem[]>([
  {
    icon : 'home',
    label : 'Inicio',
    route : 'home',
    rol: [1,2]
  },
   {
    icon : 'groups',
    label : 'Clientes',
    route : 'cliente',
    rol: [1]
  },
   {
    icon : 'schedule',
    label : 'Citas',
    route : 'citas',
    rol: [2]
  },
   {
    icon : 'content_cut',
    label : 'Servicios',
    route : 'servicios',
     rol: [1]
  },
    {
    icon : ' pending_actions',
    label : 'Gestion de Citas',
    route : 'citasdeldia',
    rol: [1]
  },
    {
    icon : ' block',
    label : 'Horarios bloqueados',
    route : 'bloquearHorarios',
    rol: [1]
  },
 ])
}
