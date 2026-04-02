using BarberiaBackend.Data;
using BarberiaBackend.Models;
using BarberiaBackend.DTOs;
using Dapper;
using System.Data;
using System.Globalization;


namespace BarberiaBackend.Services
{
    public class CitasService
    {
        private readonly BarberiaContext _context;
        private readonly ReglaBloqueo _reglaBloqueo;
        private readonly ReglaConfiguracion _reglaConfig;
        private readonly ValidacionesGenerales _validaciones;
        public CitasService(BarberiaContext context)
        {
            _context = context;

            _reglaBloqueo = new ReglaBloqueo(_context);
            _reglaConfig = new ReglaConfiguracion(_context);
            _validaciones = new ValidacionesGenerales(_context);
        }

        // 1. OBTENER CITA POR ID (buscarCita)
        public async Task<Cita?> FiltrarAsync(int id)
        {
            using var connection = _context.CreateConnection();
            var query = "EXEC buscarCita @p_id";
            var param = new { p_id = id };

            var result = await connection.QuerySingleOrDefaultAsync<Cita>(query, param);
            return result;
        }

        // 2. CREAR UNA CITA NUEVA (sp_nuevaCita)
        public async Task<CitaResultadoDto> CrearAsync(Cita cita)
        {
            using var connection = _context.CreateConnection();
           
             var servicio = await _context.Servicios.FindAsync(cita.IdServicio);
         if (servicio == null)
        {
        return new CitaResultadoDto
        {
            Codigo = 1,
            Mensaje = "El servicio seleccionado no existe."
        };
         }


            var inicio = cita.FechaHora;
             var fin = cita.FechaHora.AddMinutes(servicio.Duracion);

     
            try
            {
        _validaciones.ValidarRango(inicio, fin);
            }
              catch (Exception ex)
            {
        return new CitaResultadoDto
        {
            Codigo = 1,
            Mensaje = ex.Message
        };
    }

    try
{
    _validaciones.ValidarFechaFutura(inicio);
}
catch (Exception ex)
{
    return new CitaResultadoDto
    {
        Codigo = 1,
        Mensaje = ex.Message  
    };
}

    if (!await _reglaConfig.CumpleReservaAnticipacion(inicio))
    {
        return new CitaResultadoDto
        {
            Codigo = 1,
            Mensaje = "Debe reservar con una anticipación mínima de 1 hora."
        };
    }


    if (await _reglaBloqueo.TieneTraslapeBloqueo(inicio, fin))
    {
        return new CitaResultadoDto
        {
            Codigo = 1,
            Mensaje = "Barbero no disponible en este horario."
        };
    }

    if (await _reglaBloqueo.TieneCitasEnRango(inicio, fin))
    {
        return new CitaResultadoDto
        {
            Codigo = 1,
            Mensaje = "Ya hay una cita en ese horario."
        };
    }
            var parameters = new DynamicParameters();
            parameters.Add("idUsuario", cita.IdUsuario);
            parameters.Add("idServicio", cita.IdServicio);
            parameters.Add("fechaHora", cita.FechaHora);
            parameters.Add("resultado", dbType: DbType.Int32, direction: ParameterDirection.Output);
            
            var query = "EXEC sp_nuevaCita @idUsuario, @idServicio, @fechaHora, @resultado OUTPUT";

            await connection.ExecuteAsync(query, parameters);

            int resultado = parameters.Get<int>("resultado");

            return new CitaResultadoDto
            {
                Codigo = resultado,
                Mensaje = resultado == 0 ? "Cita creada correctamente" : "Hay un conflicto de horario con otra cita existente."
            };
        }

        // 3. ELIMINAR UNA CITA (sp_eliminar_cita)
        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.CreateConnection();
            var query = "EXEC sp_eliminar_cita @p_id_cita";
            var param = new { p_id_cita = id };
            var affected = await connection.ExecuteAsync(query, param);
            return affected > 0;
        }
        


        // 4. LISTAR CITAS POR CLIENTE (sp_listar_citas_por_cliente)
public async Task<List<CitaClienteDTO>> ListarPorClienteAsync(string idUsuario)
{
    using var connection = _context.CreateConnection();
    var query = "EXEC sp_listar_citas_por_cliente @p_id_usuario";
    var param = new { p_id_usuario = idUsuario };
    var result = await connection.QueryAsync<CitaClienteDTO>(query, param);
    return result.ToList();
}



        // 5. LISTAR CITAS DEL DÍA (sp_listar_citas_del_dia)

        public async Task<List<CitaClienteDTO>> ListarCitasDelDiaAsync(DateTime fecha)
{
    using var connection = _context.CreateConnection();

    var query = "EXEC sp_listar_citas_del_dia @p_fecha";
    var param = new { p_fecha = fecha };

    var result = await connection.QueryAsync<CitaClienteDTO>(query, param);

    return result.ToList();
}


        // 6. OBTENER HORARIOS OCUPADOS (sp_horarios_ocupados)
        public async Task<List<string>> HorariosOcupadosAsync(DateTime fecha)
        {
            using var connection = _context.CreateConnection();
            var query = "EXEC sp_horarios_ocupados @p_fecha";
            var param = new { p_fecha = fecha.Date };

            var result = await connection.QueryAsync<string>(query, param);
            return result.ToList();
        }

        // 7. CONFIRMAR UNA CITA (sp_confirmar_cita)
        public async Task<bool> ConfirmarAsync(int idCita)
        {
            using var connection = _context.CreateConnection();
            var query = "EXEC sp_confirmar_cita @p_idCita";
            var param = new { p_idCita = idCita };

            var affected = await connection.ExecuteAsync(query, param);
            return affected > 0;
        }

        // 8. CANCELAR UNA CITA (sp_cancelar_cita)
        public async Task<bool> CancelarAsync(int idCita)
        {
            using var connection = _context.CreateConnection();
            var query = "EXEC sp_cancelar_cita @p_idCita";
            var param = new { p_idCita = idCita };

            var affected = await connection.ExecuteAsync(query, param);
            return affected > 0;
        }

        // 9. REPROGRAMAR UNA CITA (sp_reprogramar_cita)
      
 public async Task<CitaResultadoDto> ReprogramarAsync(int idCita, ReprogramarCitaDTO dto)
{
    // 1. Parsear la fecha manualmente desde string
    DateTime nuevaFecha;

    try
    {
        nuevaFecha = DateTime.ParseExact(
            dto.FechaHora,
            "yyyy-MM-dd HH:mm",
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeLocal
        );
    }
    catch
    {
        return new CitaResultadoDto
        {
            Codigo = 1,
            Mensaje = "Formato de fecha inválido. Use yyyy-MM-dd HH:mm."
        };
    }

    // Logs para diagnóstico
    Console.WriteLine("📌 nuevaFecha (parseada): " + nuevaFecha);
    Console.WriteLine("📌 nuevaFecha.Kind: " + nuevaFecha.Kind);
    Console.WriteLine("📌 Now: " + DateTime.Now);
    Console.WriteLine("📌 Now.Kind: " + DateTime.Now.Kind);

    // 2. Buscar la cita
    var cita = await _context.Citas.FindAsync(idCita);
    if (cita == null)
        return new CitaResultadoDto { Codigo = 1, Mensaje = "La cita no existe." };

    // 3. Validar fecha futura
    try
    {
        _validaciones.ValidarFechaFutura(nuevaFecha);
    }
    catch (Exception ex)
    {
        return new CitaResultadoDto { Codigo = 1, Mensaje = ex.Message };
    }

    // 4. Validar anticipación mínima
    if (!await _reglaConfig.CumpleReservaAnticipacion(nuevaFecha))
    {
        return new CitaResultadoDto
        {
            Codigo = 1,
            Mensaje = "Debe reprogramar con más anticipación."
        };
    }

    // 5. Validar rango según el servicio
    var servicio = await _context.Servicios.FindAsync(cita.IdServicio);
    var inicio = nuevaFecha;
    var fin = nuevaFecha.AddMinutes(servicio.Duracion);

    try
    {
        _validaciones.ValidarRango(inicio, fin);
    }
    catch (Exception ex)
    {
        return new CitaResultadoDto { Codigo = 1, Mensaje = ex.Message };
    }

    // 6. Validar bloqueos y citas traslapadas
    if (await _reglaBloqueo.TieneTraslapeBloqueo(inicio, fin))
        return new CitaResultadoDto { Codigo = 1, Mensaje = "Existe un bloqueo en este horario." };

    if (await _reglaBloqueo.TieneCitasEnRango(inicio, fin))
        return new CitaResultadoDto { Codigo = 1, Mensaje = "Ya hay una cita en ese horario." };

    // 7. Ejecutar SP que devuelve un SELECT resultado
    using var connection = _context.CreateConnection();

    int resultadoSP = await connection.ExecuteScalarAsync<int>(
        "EXEC sp_reprogramar_cita @p_id_cita, @p_nueva_fecha",
        new { p_id_cita = idCita, p_nueva_fecha = nuevaFecha }
    );

    // 8. Interpretar resultado del SP
    return resultadoSP switch
    {
        0 => new CitaResultadoDto { Codigo = 0, Mensaje = "Cita reprogramada correctamente." },
        1 => new CitaResultadoDto { Codigo = 1, Mensaje = "Ya hay una cita cercana a ese horario." },
        2 => new CitaResultadoDto { Codigo = 1, Mensaje = "La cita no existe." },
        _ => new CitaResultadoDto { Codigo = 1, Mensaje = "Error desconocido." }
    };
}



    }
}