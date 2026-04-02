import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  public sesionLista = signal(false);

  // 🔥 Señal renombrada correctamente (antes: userActualS)
  public usuarioActual = signal<User>({
    idUsuario: "",
    nombre: "",
    rol: -1
  });

  private readonly API = environment.servidor + "/auth";

  constructor() {
    this.restaurarSesion();
  }

  // ------------------------------
  // 🔐 LOGIN
  // ------------------------------
  login(datos: any) {
    return this.http.post(`${this.API}/login`, datos).pipe(
      tap((res: any) => {

        // Guardar datos en localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('refresh', res.refreshToken);
        localStorage.setItem('usuario', res.usuarioId.toString());
        localStorage.setItem('nombre', res.nombre);
        localStorage.setItem('rol', res.rol.toString());

        // Actualizar señal del usuario
        this.usuarioActual.set({
          idUsuario: res.usuarioId.toString(),
          nombre: res.nombre,
          rol: res.rol
        });
      })
    );
  }

  // ------------------------------
  // 📝 REGISTER
  // ------------------------------
  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  // ------------------------------
  // 🔄 REFRESH TOKEN
  // ------------------------------
  refreshToken() {
    const body = {
      idUsuario: localStorage.getItem('usuario'),
      refreshToken: localStorage.getItem('refresh'),
      nombre: localStorage.getItem('nombre')
    };

    return this.http.post(`${this.API}/refresh`, body).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.newToken);
        localStorage.setItem('refresh', res.newRefresh);
      })
    );
  }

  // ------------------------------
  // ♻️ RESTAURAR SESIÓN
  // ------------------------------
  restaurarSesion() {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('rol');

    if (!token || !usuario) {
      this.sesionLista.set(true);
      return;
    }

    this.usuarioActual.set({
      idUsuario: usuario,
      nombre: nombre ?? "",
      rol: rol ? Number(rol) : -1
    });

    this.sesionLista.set(true);
  }

  // ------------------------------
  // 🚪 LOGOUT
  // ------------------------------
  logout() {
    const id = localStorage.getItem('usuario');

    this.http.post(`${this.API}/logout/${id}`, {}).subscribe(() => {

      // Limpiar almacenamiento
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('usuario');
      localStorage.removeItem('nombre');
      localStorage.removeItem('rol');

      // Resetear señal usuario
      this.usuarioActual.set({
        idUsuario: "",
        nombre: "",
        rol: -1
      });
    });
  }

  // ------------------------------
  // 🔑 GET TOKEN
  // ------------------------------
  getToken() {
    return localStorage.getItem('token');
  }

}
