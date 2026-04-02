import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';
import { MatRecycleRows } from '@angular/material/table';
import { AuthService } from '../../shared/services/authServices';
import { UsuarioService } from '../../shared/services/usuarioService';

@Component({
  selector: 'app-frm-cambiarpassw',
  standalone: true,
  templateUrl: './frm-cambiarpassw.html',
  styleUrls: ['./frm-cambiarpassw.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class FrmCambiarpassw {
  
  private fb = inject(FormBuilder);
  private srvUsuario = inject(UsuarioService);
  private srvAuth = inject(AuthService);
  readonly dialogRef = inject(MatDialogRef<FrmCambiarpassw>);
  private matDialog = inject(MatDialog);

  form: FormGroup;
  idUsuario: string = "";
  error: string = "";

  constructor() {
    this.form = this.fb.group({
      passw: ['', Validators.required],
      passwN: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {

   
    const user = this.srvAuth.usuarioActual();
    this.idUsuario = user.idUsuario;

    console.log("USUARIO CARGADO EN DIALOG:", this.idUsuario);
  }

 cambiar() {

  // Validar formulario
  if (this.form.invalid) {
    this.error = 'Por favor complete los campos correctamente.';
    return;
  }

  // Extraer valores
  const { passw, passwN } = this.form.value;

  console.log("DATOS ENVIADOS:", {
    idUsuario: this.idUsuario,
    passwordActual: passw,
    nuevaPassword: passwN
  });

  // Llamar al servicio
  this.srvUsuario.cambiarPassw(
    this.idUsuario,
    passw,
    passwN
  )
  .subscribe({
    next: () => {
      this.dialogRef.close();
      this.matDialog.open(DialogoGeneral, {
        data: {
          icono: 'check_circle',
          texto: 'La contraseña se cambió correctamente.',
          textoAceptar: 'OK'
        }
      });
    },
    error: (err) => {
      this.matDialog.open(DialogoGeneral, {
        data: {
          icono: 'error',
          texto: err.error?.mensaje || 'Error al actualizar contraseña',
          textoAceptar: 'Aceptar'
        }
      });
    }
  });
}


  cancelar() {
    this.dialogRef.close();
  }
}
