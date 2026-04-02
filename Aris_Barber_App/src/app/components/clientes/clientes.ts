import { Component, AfterViewInit, inject, signal, ViewChild } from '@angular/core';

import  {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ClientesServices } from '../../shared/services/clientes-services';
import { TipoCliente } from '../../shared/Models/interface';
import { FrmClientes } from '../../forms/frm-clientes/frm-clientes';

import { MatDialog } from '@angular/material/dialog';
import { DialogoGeneral } from '../../forms/dialogo-general/dialogo-general';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  imports: [MatIconModule,MatCardModule,MatTableModule,MatPaginator,MatPaginatorModule,CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements AfterViewInit {

  private readonly clientesSrv = inject(ClientesServices);
  private readonly dialogo = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas:string[]=['idCliente',
    'nombre',
    'apellido1',
    'apellido2',
    'celular',
    'correo',
    'botonera'
  ]

  dataSource = signal<MatTableDataSource<TipoCliente>>(new MatTableDataSource<TipoCliente>());
  

  filtro: any;

  mostrarDialogo(titulo: string, datos?: TipoCliente) {
      const dialogoRef = this.dialogo.open(FrmClientes, {
        width: '50vw',
        maxWidth: '35rem',
        data: { title: titulo, datos: datos },
        disableClose: true
      });
  
      dialogoRef.afterClosed().subscribe({
        next: (res) => {
          if (res !== false) {
            this.cargarClientes();
          }
        },
        error: (err) => console.log(err)
      });
    }

    cargarClientes() {
    this.clientesSrv.ObtenerClientes().subscribe({
      next: (data) => {
        this.dataSource().data = data;
        this.dataSource().paginator = this.paginator;
      },
      error: (err) => console.log(err)
    });
  }

  resetearFiltro() {
    this.cargarClientes();
  }


  onNuevo() {
    this.mostrarDialogo('Nuevo Cliente');
  }


  onEliminar(id: number) {
    const dialogRef = this.dialogo.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de eliminar este cliente?',
        icono: 'question_mark',
        textoAceptar: 'Si',
        textoCancelar: 'No',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.clientesSrv.EliminarCliente(id).subscribe({
          next: () => {
            this.dialogo.open(DialogoGeneral, {
              data: {
                texto: 'Cliente eliminado correctamente',
                icono: 'check_circle',
                textoAceptar: 'Aceptar',
              }
            });

            this.cargarClientes();
          },
          error: (err) => {
            console.error('Error al eliminar cliente', err);
          }
        });
      }
    });
  }


  onEditar(id: number) {
    this.clientesSrv.ObtenerClienteId(id).subscribe({
      next: (data) => {
        this.mostrarDialogo('Editar Cliente', data);
      },
      error: (err) => console.log(err)
    });
  }

  ngAfterViewInit(): void {
    this.cargarClientes();
    this.dataSource().paginator = this.paginator;
  }


}
