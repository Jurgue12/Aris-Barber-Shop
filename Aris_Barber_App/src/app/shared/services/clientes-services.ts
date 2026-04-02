import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { TipoCliente } from "../Models/interface";

const _SERVER= environment.servidor;

@Injectable({
  providedIn: 'root',
})

export class ClientesServices
{
  private readonly http = inject(HttpClient); 
  private readonly API = environment.servidor + "/Cliente";
  
  constructor() {}

  //traigo todos los clientes
  ObtenerClientes() {
   return this.http.get<TipoCliente[]>(
    `${this.API}/filtrar?parametros=%25&pagina=1&cantRegs=1000`
   );
  }
  
  //obtengo todos los cliente por un id
  ObtenerClienteId(id: number) {
  return this.http.get<TipoCliente>(
    `${this.API}/BuscarCliente?id=${id}&idCliente=0`
  );
}
  //crear un cliente nuevo
  CrearCliente(data: any){
      return this.http.post(this.API, data);
  }
  
  //Editar un cliente existente
    ActualizarCliente(data: TipoCliente) {
    return this.http.put(`${this.API}/${data.id}`, data);
  }
  
  
  // Eliminar un cliente
  EliminarCliente(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
