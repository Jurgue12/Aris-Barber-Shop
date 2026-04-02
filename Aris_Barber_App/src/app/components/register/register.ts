
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/authServices';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogoGeneral } from '../../forms/dialogo-general/dialogo-general';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule,MatInputModule,MatButtonModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
   private readonly dialog = inject(MatDialog);
   dialogRef = inject(MatDialogRef<RegisterComponent>, { optional: true });

 

  form = this.fb.group({
    idUsuario: ['', Validators.required],
    correo: ['', Validators.required],
    password: ['', Validators.required],
    nombre: ['', Validators.required],
    apellido1: ['', Validators.required],
    apellido2: ['', Validators.required],
    celular: ['', Validators.required]
  });

onRegister() {
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

  this.auth.register(this.form.value).subscribe({
    next: (res: any) => {
      if (res.codigo === -1) {
        this.dialog.open(DialogoGeneral, {
          data: {
            icono: "error",
            texto: "El ID de usuario ya está registrado.",
            textoAceptar: "Aceptar"
          }
        });

        this.form.controls['idUsuario'].setErrors({ duplicado: true });
        return;
      }

      if (res.codigo === -2) {
        this.dialog.open(DialogoGeneral, {
          data: {
            icono: "error",
            texto: "El correo electrónico ya está en uso.",
            textoAceptar: "Aceptar"
          }
        });

        this.form.controls['correo'].setErrors({ duplicado: true });
        return;
      }

      this.dialog.open(DialogoGeneral, {
        data: {
          icono: "check_circle",
          texto: "Cuenta creada correctamente. Ya puedes iniciar sesión.",
          textoAceptar: "Aceptar"
        }
      });

      this.dialogRef?.close();
    },

    error: err => {
      const mensaje = err.error?.mensaje || "Ocurrió un error inesperado al registrar.";

      this.dialog.open(DialogoGeneral, {
        data: {
          icono: "error",
          texto: mensaje,
          textoAceptar: "Aceptar"
        }
      });
    }
  });
}
  volverLogin() {
    this.dialogRef?.close();
  }
}

