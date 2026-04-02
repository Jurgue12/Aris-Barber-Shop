import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { TipoServicio } from "../Models/interface";

const _SERVER= environment.servidor;
@Injectable({
  providedIn: 'root'
})
export class ServiciosServices {
private readonly http = inject(HttpClient); 
private readonly API = environment.servidor + "/servicio";

constructor() {}

//traigo todos los servicios
ObtenerServicios() {
  return this.http.get<TipoServicio[]>(this.API);
}

//obtengo todos los servicios por un id
ObtenerServicioId(id: number) {
  return this.http.get<TipoServicio>(`${this.API}/${id}`);
}

//crear un servicio nuevo
CrearServicio(data: any){
    return this.http.post(this.API, data);
}

//Editar un servicio existente
  ActualizarServicio(data: TipoServicio) {
  return this.http.put(`${this.API}/${data.idServicio}`, data);
}


// Eliminar un servicio
EliminarServicio(id: number) {
return this.http.delete(`${this.API}/${id}`);
  }


}