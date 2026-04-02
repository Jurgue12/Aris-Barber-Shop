import { Component, inject, ViewEncapsulation } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../shared/services/authServices';
import { ServiciosServices } from '../../shared/services/serviciosServices';
import { MatSelectModule } from '@angular/material/select';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';


@Component({
  selector: 'app-frm-citas',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatDatepickerModule, CommonModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './frm-citas.html',
  styleUrl: './frm-citas.css',

  //Se utiliza para el datepicker 
  providers: [
    provideNativeDateAdapter(),
    DatePipe
  ],
})
export class FrmCitas {
  readonly dialogRef = inject(MatDialogRef<FrmCitas>);
  private readonly datePipe = inject(DatePipe);
  private readonly autSrv = inject(AuthService);
  private readonly servSrv = inject(ServiciosServices);
  private readonly citasSrv = inject(CitasServices);
  private readonly dialog = inject(MatDialog);
  readonly data = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    if (this.data?.idServicio) {
      this.frmCita.patchValue({ idServicio: this.data.idServicio });
      
    }
  const hoy = new Date();
  this.frmCita.patchValue({ fecha: hoy });
  this.onFechaChange(hoy);
  


  }
  //Horarios disponibles para sacar la cita
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
      idUsuario: [''],
      idServicio: [''],
      fechaHora: [''],
      fecha: ['']
    });

  }

reservar() {
  const idUsuario = this.autSrv.usuarioActual().idUsuario;
  const idServicio = this.frmCita.value.idServicio;

  if (!idServicio) {
    console.error('Error: idServicio no definido.');
    return;
  }

  const datos = {
    idUsuario: idUsuario,
    idServicio: Number(idServicio),
    fechaHora: this.frmCita.value.fechaHora.replace(" ", "T")
  };

  console.log('Datos a enviar:', datos);

  this.citasSrv.guardarCita(datos).subscribe({
    next: (resp) => {
      console.log('Respuesta del servidor:', resp);

      if (resp.codigo === 0) {
        this.dialogRef.close(true);
      } else {
     
        this.dialog.open(DialogoGeneral, {
          width: '420px',
          data: {
            titulo: 'No se pudo reservar la cita',
            mensaje: resp.mensaje
          }
        });
      }
    },

    error: (err) => {
  console.error('Error al guardar cita', err);

  const mensaje = err.error?.mensaje || 'Debe reservar con 1 hora de anticipación como mínimo.';

  this.dialog.open(DialogoGeneral, {
    width: '420px',
    data: {
      icono: 'warning',                                   
      texto: mensaje,                                  
      textoAceptar: 'Aceptar',                      
      textoCancelar: null                              
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

  const fechaStr = this.datePipe.transform(fechaSeleccionada, 'yyyy-MM-dd');

  const fechaHoraCompleta = `${fechaStr}T${hora}`;

  this.frmCita.patchValue({
    fechaHora: fechaHoraCompleta
  });

  this.horaSeleccionada = hora;

  console.log("Nueva fecha-hora:", fechaHoraCompleta);
}


}