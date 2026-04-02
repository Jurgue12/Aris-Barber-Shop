import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CitasServices } from '../../shared/services/citas-services';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';

@Component({
  selector: 'app-frm-reprogramarcita',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatDatepickerModule, CommonModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './frm-reprogramarcita.html',
  styleUrl: './frm-reprogramarcita.css',
  providers: [
    provideNativeDateAdapter(),
    DatePipe
  ],
})
export class FrmReprogramarcita {
  readonly dialogRef = inject(MatDialogRef<FrmReprogramarcita>);
  private readonly datePipe = inject(DatePipe);
  private readonly citasSrv = inject(CitasServices);
  readonly data = inject(MAT_DIALOG_DATA);
    private readonly dialog = inject(MatDialog);

  horariosDisponibles = [
    { hora: '09:00', ocupado: false },
    { hora: '09:30', ocupado: false },
    { hora: '10:00', ocupado: false },
    { hora: '10:30', ocupado: false },
    { hora: '11:00', ocupado: false },
    { hora: '11:30', ocupado: false },
    { hora: '12:00', ocupado: false },
    { hora: '13:00', ocupado: false },
    { hora: '13:30', ocupado: false },
    { hora: '14:00', ocupado: false },
    { hora: '14:30', ocupado: false },
    { hora: '15:00', ocupado: false },
    { hora: '15:30', ocupado: false },
    { hora: '16:00', ocupado: false },
    { hora: '16:30', ocupado: false },
    { hora: '17:00', ocupado: false },
    { hora: '17:30', ocupado: false },
    { hora: '18:00', ocupado: false },
    { hora:'18:30', ocupado: false },
    { hora: '19:00', ocupado: false },
    { hora: '19:30', ocupado: false },
    { hora: '20:00', ocupado: false },
  ];

  frmCita: FormGroup;
  private builder = inject(FormBuilder);
  horaSeleccionada: string | null = null;
  minDate = new Date();

  constructor() {
    this.frmCita = this.builder.group({
      fechaHora: [''],
      fecha: [''],
      idUsuario: [''],   
  idServicio: ['']  
    });
  }

ngOnInit() {
  if (!this.data?.idCita) {
    console.error('No se pudo obtener la cita a reprogramar');
    this.dialogRef.close();
    return;
  }

 
  if (this.data.idUsuario && this.data.idServicio) {
    this.frmCita.patchValue({
      idUsuario: this.data.idUsuario,
      idServicio: this.data.idServicio
    });
  }
}


 reprogramar() {
  const idCita = this.data.idCita;
  const nuevaFechaHora = this.frmCita.value.fechaHora;

  if (!nuevaFechaHora) {
    this.dialog.open(DialogoGeneral, {
      width: '420px',
      data: {
        icono: 'warning',
        texto: 'Debe seleccionar una nueva fecha antes de elegir la hora.',
        textoAceptar: 'Aceptar'
      }
    });
    return;
  }

  this.citasSrv.reprogramarCita(idCita, nuevaFechaHora).subscribe({
    next: (resp) => {
      console.log('Cita reprogramada correctamente', resp);

      this.dialogRef.close(true);
    },

    error: (err) => {
      console.error('Error al reprogramar cita', err);

      const mensaje =
        err.error?.mensaje ||
        'Ocurrió un error al reprogramar la cita. Intente nuevamente.';

      this.dialog.open(DialogoGeneral, {
        width: '420px',
        data: {
          icono: 'error',
          texto: mensaje,
          textoAceptar: 'Aceptar'
        }
      });
    }
  });
}



onFechaChange(fecha: Date) {
  const fechaString = this.datePipe.transform(fecha, 'yyyy-MM-dd');
  if (!fechaString) return;


  this.horaSeleccionada = null;
  this.frmCita.patchValue({ fechaHora: '' }); 

  this.citasSrv.obtenerHorasOcupadas(fechaString).subscribe({
    next: (horasOcupadas) => {
      const horasFormateadas = horasOcupadas.map((h: string) => h.substring(0, 5));

      this.horariosDisponibles = this.horariosDisponibles.map(h => ({
        ...h,
        ocupado: horasFormateadas.includes(h.hora)
      }));
    },
    error: (err) => console.error('Error al cargar horarios:', err)
  });
}

  seleccionarHora(hora: string) {
    const fechaSeleccionada = this.frmCita.value.fecha;
    if (!fechaSeleccionada) {
      console.warn('Seleccione la fecha primero');
      return;
    }
    const fechaStr = this.datePipe.transform(fechaSeleccionada, 'yyyy-MM-dd');
    const fechaHoraCompleta = `${fechaStr} ${hora}`;
    this.frmCita.patchValue({ fechaHora: fechaHoraCompleta });
    this.horaSeleccionada = hora;
    console.log('Nueva fecha/hora seleccionada:', fechaHoraCompleta);
  }
}



