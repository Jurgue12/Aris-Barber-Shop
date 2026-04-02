using BarberiaBackend.Data;
using BarberiaBackend.Models;
using Dapper;    
namespace BarberiaBackend.Services
{
    public class ServiciosService
    {
        private readonly BarberiaContext _context;

        public ServiciosService(BarberiaContext context)
        {
            _context = context;
        }


        //Traigo todos los servicios
        public async Task<List<Servicio>> ReadAsync()
        {
            using var connection = _context.CreateConnection();
            var query = "Exec sp_listar_servicios";
            var result = await connection.QueryAsync<Servicio>(query);
            return result.ToList();
        }


        //TRaigo un servicio por su ID
        public async Task<Servicio?> FiltrarAsync(int id)
        {
            using var connection = _context.CreateConnection();
            var query = "Exec buscarServicio @Id";
            var param = new { Id = id };
            var result = await connection.QuerySingleOrDefaultAsync<Servicio>(query, param);
            return result;
        }



        //Crear  un nuevo servicio
        public async Task<Servicio> CreateAsync(Servicio servicio)
       {
    using var connection = _context.CreateConnection();
    var query = "EXEC nuevoServicio @nombre, @descripcion, @duracion, @precio, @categoria";

    var parameters = new
    {
        servicio.Nombre,
        servicio.Descripcion,
        servicio.Duracion,
        servicio.Precio,
        servicio.Categoria
    };

    var id = await connection.ExecuteScalarAsync<int>(query, parameters);
    servicio.IdServicio = id;
    return servicio;
}


        //Editar un servicio
        public async Task<Servicio?> UpdateAsync(int id, Servicio servicio)
        {
            using var connection = _context.CreateConnection();
            var query = "Exec editarServicio @Id, @nombre, @descripcion,@duracion, @precio,@categoria";
            var param = new
            {
                Id = id,
                Nombre = servicio.Nombre,
                Descripcion = servicio.Descripcion,
                Duracion = servicio.Duracion,
                Precio = servicio.Precio,
                Categoria = servicio.Categoria
            };
            var filasAfectadas = await connection.ExecuteAsync(query, param);
            if (filasAfectadas == 0) return null;
            return servicio;
        }
        

        //Eliminar un servicio
        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.CreateConnection();
            var query = "Exec eliminarServicio @Id";
            var param = new { Id = id };
            var filasAfectadas = await connection.ExecuteAsync(query, param);
            return filasAfectadas > 0;
        }
    }
}