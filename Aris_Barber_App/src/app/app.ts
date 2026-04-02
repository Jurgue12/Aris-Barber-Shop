import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from './components/sidenav/sidenav';
import { initFlowbite } from 'flowbite';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Sidenav,Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'BarberiaFrontend';


   ngOnInit(): void {
    initFlowbite();
  }

}


