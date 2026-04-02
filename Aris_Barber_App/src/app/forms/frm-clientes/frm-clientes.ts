import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientesServices } from '../../shared/services/clientes-services';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';

@Component({
  selector: 'app-frm-clientes',
  imports: [MatDialogModule, MatIconModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-clientes.html',
  styleUrl: './frm-clientes.css',
})
export class FrmClientes implements OnInit{
  titulo!: string;
  srvClientes = inject(ClientesServices);
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  dialogRef = inject(MatDialogRef<FrmClientes>);
  private builder = inject(FormBuilder);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      id: [0],
      idCliente: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      celular:[''],
      correo: [''],
    });

  }

  get F() {
    return this.myForm.controls;
  }

  onGuardar() {

    if (this.myForm.invalid) {
      return;
    }

    if (this.myForm.value.id === 0) {
      this.srvClientes.CrearCliente(this.myForm.value).subscribe({
        complete: () => {
          this.dialog.open(DialogoGeneral, {
            data: {
              texto: 'Cliente creado correctamente',
              icono: 'check_circle',
              textoAceptar: 'Aceptar',

            }

          });
          this.dialogRef.close();
        }
      })

    } else {
       this.srvClientes.ActualizarCliente(this.myForm.value)
      .subscribe({
        complete: () => {
          this.dialog.open(DialogoGeneral, {
            data: {
              texto: 'Cliente actualizado correctamente',
              icono: 'check_circle',
              textoAceptar: 'Aceptar',
            }
            });
            this.dialogRef.close();
          }
        })
    }
  }


  ngOnInit(): void {
    this.titulo = this.data.title;

    console.log(this.data);
    if (this.data.datos) {
      const d = this.data.datos[0]; 

      this.myForm.setValue({
        id: d.Id,
       idCliente: d.IdCliente,
       nombre: d.Nombre,
       apellido1: d.Apellido1,
       apellido2: d.Apellido2,
        celular: d.Celular,
        correo: d.Correo,
     
      });

    }
  }


}
