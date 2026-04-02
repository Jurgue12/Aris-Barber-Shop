import { AfterViewInit, Component, effect, inject,signal, ViewChild } from '@angular/core';
import { ServiciosServices } from '../../shared/services/serviciosServices';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import{MatIconModule} from '@angular/material/icon';
import {  TipoCita, TipoServicio } from '../../shared/Models/interface';
import {MatDialog} from '@angular/material/dialog';
import { FrmServicios } from '../../forms/frm-servicios/frm-servicios';
import { DialogoGeneral } from '../../forms/dialogo-general/dialogo-general';
import { FrmCitas } from '../../forms/frm-citas/frm-citas';
import { CitasServices } from '../../shared/services/citas-services';
import { AuthService } from '../../shared/services/authServices';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FrmReprogramarcita } from '../../forms/frm-reprogramarcita/frm-reprogramarcita';
import { MatTooltipModule } from '@angular/material/tooltip';
import {  OnInit, ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-citas',
  imports: [MatIconModule,MatCardModule,MatTableModule,CommonModule,
MatCardModule,MatTableModule,MatIconModule,MatExpansionModule,MatPaginator,MatPaginatorModule,
    MatFormFieldModule,MatInputModule,MatTooltipModule
  ],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements AfterViewInit {
  private readonly serviciosSrv = inject(ServiciosServices );
  private readonly dialogo = inject(MatDialog);
  private readonly citasSrv= inject(CitasServices);
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);


@ViewChild('paginatorServicios') paginatorServicios!: MatPaginator;
@ViewChild('paginatorCitas') paginatorCitas!: MatPaginator;

     panelOpenState=signal(false);
   
  columnas: string[] =['nombre','descripcion','duracion','precio','categoria','botonera'];
  columnasCitas = ['nombreCliente','servicio', 'fechaHora', 'estado', 'opciones'];

  dataSource= signal(new MatTableDataSource<TipoServicio>());
   dataSourceCitas= signal(new MatTableDataSource<TipoCita>());
   filtro: any;
   filtroCitas: any;

   constructor() {
      effect(() => {
      if (this.auth.sesionLista()) {
        this.cargarTodo();
      }
    });
   }

     cargarTodo() {
    this.filtro = { nombre: '', descripcion: '', duracion: '', precio: '', categoria: '' };
    this.filtrar();

    this.filtroCitas = { nombreCliente: '', servicio: '', fechaHora: '', estado: '' };
    this.filtrarCitas();
  }
//actualizar los servicios cuando hay uno nuevo(resetea)
resetearFiltroServicios(){
  this.filtro = { nombre: '', descripcion: '', duracion: '', precio: '', categoria: '' };
     this.filtrar();
}

//actualizar las citas(resetea)
resetearFiltroCitas(){
  this.filtro = { nombreCliente: '',servicio: '', fechaHora: '', estado: '' };
     this.filtrarCitas();
 
}

//filtro citas por cada usuario
filtrarCitas() {
  const idUsuario = this.auth.usuarioActual().idUsuario;  
  this.citasSrv.obtenerCitasPorUsuario(idUsuario).subscribe({
    next: (data) => {
      console.log(data);
       this.dataSourceCitas().data = data;
      this.dataSourceCitas().paginator = this.paginatorCitas;
       this.cdr.detectChanges(); 
    },
    error: (err) => console.log(err)
  });
}
//Me trae todos los servicios de la base de datos
  filtrar(){
this.serviciosSrv.ObtenerServicios().subscribe({
  next : (data) =>{console.log(data)
       this.dataSource().data = data;
      this.dataSource().paginator = this.paginatorServicios;  
  },
  error : (err) => console.log(err)
});
 }

 //actualizo el filtro
onReservar(idServicio: number) {
  const dialogRef = this.dialogo.open(FrmCitas, {
    width: '400px',
    data: { idServicio }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.dialogo.open(DialogoGeneral, {
        data: {
          texto: 'Cita reservada correctamente',
          icono: 'check_circle',
          textoAceptar: 'Aceptar'
        }
      });
      this.filtrarCitas();
    }
  });
}

//cancelo una cita
onCancelarCita(id: number) {
    const dialogRef = this.dialogo.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de cancelar la cita?',
        icono: 'question_mark',
        textoAceptar: 'Si',
        textoCancelar: 'No',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.citasSrv.cancelarCita(id).subscribe({
          next: () => {
            this.dialogo.open(DialogoGeneral, {
              data: {
                texto: 'Cita cancelada correctamente',
                icono: 'check_circle',
                textoAceptar: 'Aceptar',
              }
            });

            this.filtrarCitas();
          },
          error: (err) => {
            console.error('Error al cancelar cita', err);
          }
        });
      }
    });
  }

//Reprogramar una cita
onReprogramarCita(idCita: number) {
  const dialogRef = this.dialogo.open(FrmReprogramarcita, {
    width: '400px',
    data: { idCita }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.dialogo.open(DialogoGeneral, {
        data: {
          texto: 'Cita reprogramada correctamente',
          icono: 'check_circle',
          textoAceptar: 'Aceptar'
        }
      });
      this.filtrarCitas();
    }
  });
}

onVerDetalleCita(id: number) {
  this.citasSrv.buscarCita(id).subscribe({
    next: (detalle) => {
      this.dialogo.open(DialogoGeneral, {
        data: {
          texto: `
            Servicio: ${detalle.servicio}
            Fecha: ${detalle.fechaHora}
            Estado: ${detalle.estado}
          `,
          icono: 'info',
          textoAceptar: 'Aceptar'
        }
      });
    },
    error: (err) => console.error('Error al obtener detalle', err)
  });
}

 
   ngAfterViewInit(): void {
     this.filtro = {nombre: '', descripcion: '', duracion: '', precio: '', categoria: '' };
     this.filtrar();
      this.dataSource().paginator = this.paginatorServicios;

      this.filtroCitas = {nombreCliente: '', servicio: '', fechaHora: '', estado: ''};
     this.filtrarCitas();
           this.dataSource().paginator = this.paginatorServicios;
      this.dataSourceCitas().paginator = this.paginatorCitas;
   
 }
 

}