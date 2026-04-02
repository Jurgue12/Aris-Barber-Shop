import { AfterViewInit, Component, inject } from '@angular/core';
import { BloqueoService } from '../../shared/services/bloqueoServices';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DialogoGeneral } from '../../forms/dialogo-general/dialogo-general';
import {  OnInit, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-bloqueo-barbero',
  standalone: true,
  imports: [
    MatIconModule, MatCardModule, MatTableModule, FormsModule,
    MatTooltipModule, CommonModule, MatDatepickerModule, MatNativeDateModule,
    MatFormFieldModule, MatInputModule, RouterModule, MatSelectModule
  ],
  templateUrl: './bloqueo-barbero.html',
  styleUrl: './bloqueo-barbero.css',
})
export class BloqueoBarbero implements AfterViewInit {
  private readonly bloqueoSrv = inject(BloqueoService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);


  bloqFecha: any;
  bloqHoraInicio: string = '';
  bloqHoraFin: string = '';
  bloqMotivo: string = '';
  bloqueos: any[] = [];


  ngOnInit() {
    this.cargarBloqueos();
  }
  constructor() {
  }

  cargarBloqueos() {
    this.bloqueoSrv.listarBloqueos().subscribe({
      next: (data) => {
        console.log("Bloqueos obtenidos:", data);
        this.bloqueos = data;
           this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Error cargando bloqueos", err);
      }
    });
  }


  crearBloqueo() {
    if (!this.bloqFecha || !this.bloqHoraInicio || !this.bloqHoraFin || !this.bloqMotivo) {
      this.dialog.open(DialogoGeneral, {
        width: '420px',
        data: {
          icono: 'warning',
          texto: 'Debe completar todos los campos.',
          textoAceptar: 'Aceptar'
        }
      });
      return;
    }

  
    const fechaISO = new Date(this.bloqFecha).toISOString().split('T')[0];


    const bloqueo = {
      inicio: `${fechaISO}T${this.bloqHoraInicio}`,
      fin: `${fechaISO}T${this.bloqHoraFin}`,
      motivo: this.bloqMotivo
    };


    this.bloqueoSrv.crearBloqueo(bloqueo).subscribe({
      next: () => {
        this.dialog.open(DialogoGeneral, {
          width: '420px',
          data: {
            icono: 'check_circle',
            texto: 'Bloqueo creado correctamente.',
            textoAceptar: 'OK'
          }
        });

  
        this.cargarBloqueos();

  
        this.bloqFecha = null;
        this.bloqHoraInicio = '';
        this.bloqHoraFin = '';
        this.bloqMotivo = '';
      },

      error: (err) => {
        console.error('Error creando bloqueo', err);

        const mensaje = err.error?.mensaje || 'Ocurrió un error al crear el bloqueo.';

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


  eliminarBloqueo(id: number) {

    const ref = this.dialog.open(DialogoGeneral, {
      width: '420px',
      data: {
        icono: 'warning',
        texto: '¿Desea eliminar este bloqueo?',
        textoAceptar: 'Eliminar',
        textoCancelar: 'Cancelar'
      }
    });

    ref.afterClosed().subscribe(res => {
      if (!res) return;

      this.bloqueoSrv.eliminarBloqueo(id).subscribe({
        next: () => {
          this.dialog.open(DialogoGeneral, {
            width: '420px',
            data: {
              icono: 'check_circle',
              texto: 'Bloqueo eliminado correctamente.',
              textoAceptar: 'OK'
            }
          });

          this.cargarBloqueos();
        },

        error: (err) => {
          console.error("Error eliminando bloqueo", err);

          const mensaje = err.error?.mensaje || 'No se pudo eliminar el bloqueo.';

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
    });

  }

  ngAfterViewInit(): void {
  
  }

}
