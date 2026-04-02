using BarberiaBackend.Data;
using BarberiaBackend.Models;
using BarberiaBackend.DTOs;
using Dapper;

namespace BarberiaBackend.Services
{
    public class BloqueoService
    {
        private readonly BarberiaContext _context;

        public BloqueoService(BarberiaContext context)
        {
            _context = context;
        }


        public async Task<BloqueoResultadoDto> CrearAsync(BloqueoCreateDTO dto)
        {
            using var connection = _context.CreateConnection();

            var query = "EXEC sp_crear_bloqueo @Inicio, @Fin, @Motivo";

            var result = await connection.QueryFirstAsync<BloqueoResultadoDto>(query, new
            {
                Inicio = dto.Inicio,
                Fin = dto.Fin,
                Motivo = dto.Motivo
            });

            return result;
        }

        public async Task<List<BloqueoDTO>> ListarPorFechaAsync(DateTime fecha)
        {
            using var connection = _context.CreateConnection();

            var query = "EXEC sp_listar_bloqueos_por_fecha @Fecha";

            var result = await connection.QueryAsync<BloqueoDTO>(query, new
            {
                Fecha = fecha.Date
            });

            return result.ToList();
        }

   
        public async Task<BloqueoResultadoDto> EliminarAsync(int id)
        {
            using var connection = _context.CreateConnection();

            var query = "EXEC sp_eliminar_bloqueo @ID";

            var result = await connection.QueryFirstAsync<BloqueoResultadoDto>(query, new
            {
                ID = id
            });

            return result;
        }

        public async Task<List<BloqueoDTO>> ListarTodosAsync()
{
    using var connection = _context.CreateConnection();

    var query = "EXEC sp_listar_bloqueos";

    var result = await connection.QueryAsync<BloqueoDTO>(query);

    return result.ToList();
}

    }
}
