import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { CitaCreate, TipoCita } from '../Models/interface';
import { environment } from '../../../environments/environment.development';

const _SERVER = environment.servidor;

@Injectable({
  providedIn: 'root'
})
export class CitasServices {
  private readonly http = inject(HttpClient);

  constructor() { }

  // Detecta las horas que ya están ocupadas por un usuario
  // GET api/Citas/horarios-ocupados/{fecha}
  obtenerHorasOcupadas(fecha: string): Observable<string[]> {
    return this.http.get<string[]>(`${_SERVER}/Citas/horarios-ocupados/${fecha}`);
  }

  // Obtener citas de un cliente en especifico
  // GET api/Citas/cliente/{idUsuario}
  obtenerCitasPorUsuario(idUsuario: string): Observable<any> {
    return this.http.get(`${_SERVER}/Citas/cliente/${idUsuario}`);
  }

  // Obtener lista de servicios disponibles
  // GET api/Servicio
  obtenerServicios(): Observable<any> {
    // Asumiendo que el controlador de servicios está en /api/Servicio
    return this.http.get(`${_SERVER}/Servicio`); 
  }

  // Obtener citas de un día en específico (Reemplaza a 'gestionarCitas' y 'getCitasDelDia')
  // GET api/Citas/dia/{fecha}
  getCitasDelDia(fecha: string): Observable<any> {
    return this.http.get(`${_SERVER}/Citas/dia/${fecha}`);
  }

  // Reprogramar una cita
  // PUT api/Citas/reprogramar/{id}

  reprogramarCita(id: number, fechaHora: string): Observable<any> {
  return this.http.put(`${_SERVER}/Citas/reprogramar/${id}`, {
    fechaHora : fechaHora  
  });
}


  // Crear cita
  // POST api/Citas
  guardarCita(datos: CitaCreate): Observable<any> {
    // Si la cita se crea correctamente (Código 0), devuelve 200/201.
    // Si hay conflicto (Código 1), devuelve 409 Conflict.
    return this.http.post(`${_SERVER}/Citas`, datos);
  }

  // Confirma una cita (cambia de estado a 'confirmada')
  // PUT api/Citas/confirmar/{id}
  confirmarCita(id: number): Observable<any> {
    return this.http.put(`${_SERVER}/Citas/confirmar/${id}`, {});
  }

  // Cancela una cita (cambia de estado a 'cancelada')
  // PUT api/Citas/cancelar/{id}
  cancelarCita(id: number): Observable<any> {
    return this.http.put(`${_SERVER}/Citas/cancelar/${id}`, {});
  }

  // Eliminar una cita
  // DELETE api/Citas/{id}
  eliminarCita(id: number): Observable<boolean> {
    return this.http.delete(`${_SERVER}/Citas/${id}`).pipe(
      retry(1),
      map(() => true), // Asume éxito si no hay error
      catchError(this.handleError)
    );
  }

  // Buscar cita por id
  // GET api/Citas/{id}
  buscarCita(id: number): Observable<any> {
    return this.http.get(`${_SERVER}/Citas/${id}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  

  // Manejo de errores
  private handleError(error: any) {
    return throwError(() => error.status);
  }
}