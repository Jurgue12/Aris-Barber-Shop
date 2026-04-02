import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AdminServices {

private readonly http= inject(HttpClient);
private readonly API=  environment.servidor + "/admin";


constructor(){}

//Mostrar el administrador
ObtenerAdmins() {
    return this.http.get<any[]>(`${this.API}/read`);
}


//Mostrar un administrador por id
ObtenerAdminId(id: number) {
    return this.http.get<any>(`${this.API}/${id}`);
}


//Crear un administrador nuevo
CrearAdmin(data: any){
    return this.http.post(this.API, data);
}

//Editar un administrador existente
ActualizarAdmin(data: any) {
  return this.http.put(`${this.API}/edit/${data.idAdministrador}`, data);
}

//Eliminar un administrador
EliminarAdmin(id: number) {
    return this.http.delete(`${this.API}/delete/${id}`);
  }


}