import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly http = inject(HttpClient);
  private readonly API = environment.servidor + "/usuarios";

  constructor() {}

cambiarPassw(idUsuario: string, passActual: string, passNueva: string) {
  return this.http.put(`${this.API}/cambiar-password`, {
    idUsuario: idUsuario,
    passwordActual: passActual,
    nuevaPassword: passNueva
  });
}


}
