import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ServiciosServices } from '../../shared/services/serviciosServices';
import { Dial } from 'flowbite';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';



@Component({
  selector: 'app-frm-servicios',
  imports: [MatDialogModule, MatIconModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-servicios.html',
  styleUrl: './frm-servicios.css'
})
export class FrmServicios implements OnInit {
  titulo!: string;
  srvServicios = inject(ServiciosServices);
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  dialogRef = inject(MatDialogRef<FrmServicios>);


  private builder = inject(FormBuilder);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      idServicio: [0],
      nombre: [''],
      descripcion: [''],
      duracion: [''],
      precio: [''],
      categoria: ['']
    });

  }



  get F() {
    return this.myForm.controls;
  }


  onGuardar() {
    if (this.myForm.value.idServicio === 0) {
      this.srvServicios.CrearServicio(this.myForm.value).subscribe({
        complete: () => {
          this.dialog.open(DialogoGeneral, {
            data: {
              texto: 'Servicio creado correctamente',
              icono: 'check_circle',
              textoAceptar: 'Aceptar',

            }

          });
          this.dialogRef.close();
        }
      })

    } else {
       this.srvServicios.ActualizarServicio(this.myForm.value)
      .subscribe({
        complete: () => {
          this.dialog.open(DialogoGeneral, {
            data: {
              texto: 'Servicio actualizado correctamente',
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
      this.myForm.setValue({
        idServicio: this.data.datos.idServicio,
        nombre: this.data.datos.nombre,
        descripcion: this.data.datos.descripcion,
        duracion: this.data.datos.duracion,
        precio: this.data.datos.precio,
        categoria: this.data.datos.categoria
      });

    }

  }
}
