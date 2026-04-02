import { Component, inject, Optional } from '@angular/core';
import { AuthService } from '../../shared/services/authServices';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogoGeneral } from '../../forms/dialogo-general/dialogo-general';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);


  constructor(@Optional() private dialogRef?: MatDialogRef<Login>) {}

  form = this.fb.group({
    idUsuario: ['', Validators.required],
    password: ['', Validators.required]
  });

  onLogin() {

    if (this.form.invalid) {
      this.dialog.open(DialogoGeneral, {
        data: {
          icono: "priority_high",
          texto: "Debes completar todos los campos",
          textoAceptar: "Aceptar"
        }
      });
      return;
    }

    this.auth.login(this.form.value).subscribe({
      next: (resp: any) => {

       
        localStorage.setItem('token', resp.token);
        localStorage.setItem('refresh', resp.tkRef);
        localStorage.setItem('usuario', resp.usuario);
        localStorage.setItem('nombre', resp.nombre);

   
        if (this.dialogRef) this.dialogRef.close();

        this.dialog.open(DialogoGeneral, {
          data: {
            icono: "check_circle",
            texto: "Inicio de sesión exitoso",
            textoAceptar: "Aceptar"
          }
        });

        this.router.navigate(['/home']);
      },

      error: () => {
        this.dialog.open(DialogoGeneral, {
          data: {
            icono: "error",
            texto: "Usuario o contraseña incorrectos",
            textoAceptar: "Aceptar"
          }
        });

        this.form.reset();
      }
    });
  }

  abrirRegister() {
    this.dialog.open(RegisterComponent, {
      width: '400px'
    });
  }
}
