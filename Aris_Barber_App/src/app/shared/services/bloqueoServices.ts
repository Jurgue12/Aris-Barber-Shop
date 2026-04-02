import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";

const _SERVER = environment.servidor;

@Injectable({
  providedIn: 'root'
})
export class BloqueoService {

  private URL = `${_SERVER}/bloqueo`;

  constructor(private http: HttpClient) {}

 

  crearBloqueo(data: any): Observable<any> {
    return this.http.post(this.URL, data);
  }


  listarBloqueos(): Observable<any> {
    return this.http.get(this.URL);
  }

 
  eliminarBloqueo(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`);
  }


}
