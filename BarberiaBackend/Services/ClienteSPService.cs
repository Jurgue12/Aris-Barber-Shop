using BarberiaBackend.Data;
using BarberiaBackend.DTOs;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace BarberiaBackend.Services
{
    public class ClienteSPService
    {
        private readonly BarberiaContext _context;

        public ClienteSPService(BarberiaContext context)
        {
            _context = context;
        }




        public async Task<IEnumerable<dynamic>> BuscarCliente(int id, string idCliente)
        {
      
             using var connection = _context.CreateConnection();
            return await connection.QueryAsync(

                "buscarCliente",
                new { id, idCliente },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<dynamic>> FiltrarCliente(string parametros, int pagina, int cantRegs)
        {

            using var connection = _context.CreateConnection();


            return await connection.QueryAsync(
                "filtrarCliente",
                new { parametros, pagina, cantRegs },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> NumRegsCliente(string parametros)
        {

              using var connection = _context.CreateConnection();


            return await connection.QueryFirstAsync<int>(
                "numRegsCliente",
                new { parametros },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> NuevoCliente(ClienteCreateDTO dto)
        {

             using var connection = _context.CreateConnection();


            return await connection.QueryFirstAsync<int>(
                "nuevoCliente",
                new
                {
                    dto.IdCliente,
                    dto.IdUsuario,
                    dto.Nombre,
                    dto.Apellido1,
                    dto.Apellido2,
                    dto.Celular,
                    dto.Correo
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> EditarCliente(int id, ClienteUpdateDTO dto)
        {

             using var connection = _context.CreateConnection();


            return await connection.QueryFirstAsync<int>(
                "editarCliente",
                new
                {
                    id,
                    dto.IdCliente,
                    dto.Nombre,
                    dto.Apellido1,
                    dto.Apellido2,
                    dto.Celular,
                    dto.Correo
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> EliminarCliente(int id)
        {

             using var connection = _context.CreateConnection();

            return await connection.QueryFirstAsync<int>(
                "eliminarCliente",
                new { id },
                commandType: CommandType.StoredProcedure
            );
        }
    }
}
