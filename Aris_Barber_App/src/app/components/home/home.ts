import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/authServices';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Login } from '../login/login';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
    private auth = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  reservarCita() {
    if (this.auth.getToken()) {
      // está logueado, redirigir a la vista de citas
      this.router.navigate(['/citas']);
    } else {
      // no está logueado, abrir login modal
      this.dialog.open(Login, {
        width: '400px',
        disableClose: true
      });
    }
  }

  redirigir(){
    const rol = this.auth.usuarioActual().rol;
    if(rol ===1){
      this.router.navigate(['/home']);
    }else if(rol ===2){
      this.router.navigate(['/citas']);
    }else if(this.auth.getToken() === null){
      this.router.navigate(['/login']);
  }
}
}
