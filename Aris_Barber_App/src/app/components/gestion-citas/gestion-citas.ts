import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CitasServices } from '../../shared/services/citas-services';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { TipoCita } from '../../shared/Models/interface';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormField } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FrmReprogramarcita } from '../../forms/frm-reprogramarcita/frm-reprogramarcita';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { DialogoGeneral } from '../../forms/dialogo-general/dialogo-general';
import { BloqueoService } from '../../shared/services/bloqueoServices';


@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatTableModule,FormsModule, 
    MatTooltipModule,CommonModule,MatDatepickerModule,MatNativeDateModule,
    MatFormField,MatInputModule,MatFormFieldModule,RouterModule,MatSelectModule,MatPaginator],
     providers: [DatePipe],
  templateUrl: './gestion-citas.html',
  styleUrl: './gestion-citas.css'
})
export class GestionCitas implements AfterViewInit {

  private readonly citasSrv = inject(CitasServices);
  private readonly dialog = inject(MatDialog);


    @ViewChild(MatPaginator) paginator!: MatPaginator;
  columnasCitas = ['servicio', 'nombreCliente', 'fechaHora', 'estado', 'opciones'];
estadoSeleccionado: string = '';

  dataSourceCitas = signal(new MatTableDataSource<TipoCita>([])); 

  filtro: any;
  dialogo: any;


  fechaSeleccionada: Date = new Date();


obtenerCitasHoy() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const fechaFormateada = `${yyyy}-${mm}-${dd}`;

  this.citasSrv.getCitasDelDia(fechaFormateada).subscribe({
    next: (data) => {
      console.log('Citas del día:', data);

      this.dataSourceCitas().data = data || [];
      this.dataSourceCitas().paginator = this.paginator;
    },
    error: (err) => {
      console.error('Error al obtener citas:', err);
      this.dataSourceCitas().data = [];
      this.dataSourceCitas().paginator = this.paginator;
    }
  });
}

filtrarPorEstado() {
  if (!this.estadoSeleccionado) {
    this.dataSourceCitas().filter = ''; 
  } else {
    this.dataSourceCitas().filter = this.estadoSeleccionado.trim().toLowerCase();
  }
}


onConfirmarCita(id: number) {
 
  const dialogRef = this.dialog.open(DialogoGeneral, {
    data: {
      texto: '¿Desea confirmar esta cita?',
      icono: 'help',
      textoAceptar: 'Sí, confirmar',
      textoCancelar: 'No'
    }
  });

 
  dialogRef.afterClosed().subscribe((res) => {

    if (res === true) {   

      this.citasSrv.confirmarCita(id).subscribe({
        next: (resp) => {

     
          this.dialog.open(DialogoGeneral, {
            data: {
              texto: 'Cita confirmada correctamente',
              icono: 'check_circle',
              textoAceptar: 'Aceptar'
            }
          });

       
          this.obtenerCitasHoy();
        },

        error: (err) => console.error('Error al confirmar cita:', err)
      });

    }

  });

}

buscarCitasPorFecha() {
  const fecha = this.fechaSeleccionada;
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${yyyy}-${mm}-${dd}`;

  this.citasSrv.getCitasDelDia(fechaFormateada).subscribe({
    next: (data) => {
      console.log('Citas del día:', data);

      this.dataSourceCitas().data = data || [];
      this.dataSourceCitas().paginator = this.paginator;
    },
    error: (err) => {
      console.error('Error al obtener citas:', err);
      this.dataSourceCitas().data = [];
      this.dataSourceCitas().paginator = this.paginator;
    }
  });
}


onCancelarCita(id: number) {

  const dialogRef = this.dialog.open(DialogoGeneral, {
    data: {
      texto: '¿Desea cancelar esta cita?',
      icono: 'help',
      textoAceptar: 'Sí, cancelar',
      textoCancelar: 'No'
    }
  });

  dialogRef.afterClosed().subscribe((res) => {

    if (res === true) {   

      this.citasSrv.cancelarCita(id).subscribe({
        next: (resp) => {

          this.dialog.open(DialogoGeneral, {
            data: {
              texto: 'Cita cancelada correctamente',
              icono: 'check_circle',
              textoAceptar: 'Aceptar'
            }
          });

          this.obtenerCitasHoy();
        },
        error: (err) => console.error('Error al cancelar cita:', err)
      });

    }

  });
}

  resetearFiltroCitas() {
    this.filtro = { servicio: '', nombreCliente: '', fechaHora: '', estado: '' };
    this.obtenerCitasHoy();
  }

 
onReprogramarCita(idCita: number) {
  const dialogRef = this.dialog.open(FrmReprogramarcita, {
    width: '400px',
    data: { idCita }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.dialog.open(DialogoGeneral, {
        data: {
          texto: 'Cita reprogramada correctamente',
          icono: 'check_circle',
          textoAceptar: 'Aceptar'
        }
      });
      this.obtenerCitasHoy();
    }
  });
}

  onVerDetalleCita(id: number) {
    console.log('Ver detalle cita', id);
  }


  ngAfterViewInit(): void {
    this.filtro = { servicio: '',nombreCliente: '', fechaHora: '', estado: '' };
    this.obtenerCitasHoy();
        this.dataSourceCitas().paginator = this.paginator;
  }
}
