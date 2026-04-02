export interface TipoServicio {
  idServicio?: number,
  nombre: string,
  descripcion: string,
  duracion: string,
  precio: number,
  categoria: string
};

export interface TipoCliente{
  id?: number,
  idCliente: string,
  idUsuario: string,
  nombre: string,
  apellido1: string,
  apellido2: string,
  celular?: string | null,
  correo: string,
  fechaIngreso?: Date | string
}

export interface TipoCita {
  id?: number,
  nombreCliente: string,
  servicio: string,
  fechaHora: string,
  estado?: string,
  notas?: string | null
}

export interface CitaCreate {
  idUsuario: string;
  idServicio: number;
  fechaHora: string;
}
