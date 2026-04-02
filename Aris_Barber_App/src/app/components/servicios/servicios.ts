import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ServiciosServices } from '../../shared/services/serviciosServices';
import { TipoServicio } from '../../shared/Models/interface';
import { FrmServicios } from '../../forms/frm-servicios/frm-servicios';
import { MatDialog } from '@angular/material/dialog';
import { DialogoGeneral } from '../../forms/dialogo-general/dialogo-general';
@Component({
  selector: 'app-servicios',
  imports: [MatIconModule,MatCardModule,MatTableModule,MatPaginator,MatPaginatorModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios  implements AfterViewInit{

  private readonly serviciosSrv = inject(ServiciosServices);
  private readonly dialogo = inject(MatDialog);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['nombre', 'descripcion', 'duracion', 'precio', 'categoria', 'botonera'];
  
  dataSource = signal<MatTableDataSource<TipoServicio>>(new MatTableDataSource<TipoServicio>());

  
  filtro: any;

  mostrarDialogo(titulo: string, datos?: TipoServicio) {
    const dialogoRef = this.dialogo.open(FrmServicios, {
      width: '50vw',
      maxWidth: '35rem',
      data: { title: titulo, datos: datos },
      disableClose: true
    });

    dialogoRef.afterClosed().subscribe({
      next: (res) => {
        if (res !== false) {
          this.cargarServicios();
        }
      },
      error: (err) => console.log(err)
    });
  }

  resetearFiltro() {
    this.cargarServicios();
  }

  cargarServicios() {
    this.serviciosSrv.ObtenerServicios().subscribe({
      next: (data) => {
        this.dataSource().data = data;
        this.dataSource().paginator = this.paginator;
      },
      error: (err) => console.log(err)
    });
  }

  onNuevo() {
    this.mostrarDialogo('Nuevo Servicio');
  }

  onEliminar(id: number) {
    const dialogRef = this.dialogo.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de eliminar este servicio?',
        icono: 'question_mark',
        textoAceptar: 'Si',
        textoCancelar: 'No',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.serviciosSrv.EliminarServicio(id).subscribe({
          next: () => {
            this.dialogo.open(DialogoGeneral, {
              data: {
                texto: 'Servicio eliminado correctamente',
                icono: 'check_circle',
                textoAceptar: 'Aceptar',
              }
            });

            this.cargarServicios();
          },
          error: (err) => {
            console.error('Error al eliminar servicio', err);
          }
        });
      }
    });
  }

  onEditar(idServicio: number) {
    this.serviciosSrv.ObtenerServicioId(idServicio).subscribe({
      next: (data) => {
        this.mostrarDialogo('Editar Servicio', data);
      },
      error: (err) => console.log(err)
    });
  }

  ngAfterViewInit(): void {
    this.cargarServicios();
    this.dataSource().paginator = this.paginator;
  }


}
