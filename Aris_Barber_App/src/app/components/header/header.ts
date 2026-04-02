import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Login } from '../login/login';  
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/authServices';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FrmCambiarpassw } from '../../forms/frm-cambiarpassw/frm-cambiarpassw';

@Component({
  selector: 'app-header',
    imports: [CommonModule,MatIconModule,MatIcon,MatMenuModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 usuario: any = null; 
  private dialog = inject(MatDialog);
   srvAuth = inject(AuthService);
    private readonly router = inject(Router);

  abrirLogin() {
    this.dialog.open(Login, {
      width: '380px',
      disableClose: false
    });
  }

   cerrarSesion() {
    this.srvAuth.logout();
     this.router.navigate(['/home']);
  }

   cambiarPass() {
   this.dialog.open(FrmCambiarpassw, {
       width: '380px',
      disableClose: false
    });
  }

}
