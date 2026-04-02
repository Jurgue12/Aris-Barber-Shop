using BarberiaBackend.Data;
using BarberiaBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace BarberiaBackend.Services
{
    public class UsuariosService
    {
        private readonly BarberiaContext _context;
          private readonly PasswordHasher<Usuario> _hasher;

        public UsuariosService(BarberiaContext context)
        {
            _context = context;
             _hasher = new PasswordHasher<Usuario>();
        }

        // Buscar usuario (por id o idUsuario)
        public Task<Usuario?> BuscarUsuarioAsync(int? id, string? idUsuario)
        {
            var p1 = new SqlParameter("@id", id ?? (object)DBNull.Value);
            var p2 = new SqlParameter("@idUsuario", idUsuario ?? (object)DBNull.Value);

            var usuario = _context.Usuarios
                .FromSqlRaw("EXEC buscarUsuario @id, @idUsuario", p1, p2)
                .AsEnumerable()
                .FirstOrDefault();

            return Task.FromResult(usuario);
        }


      
   
  public async Task<bool> CambiarPasswordAsync(string idUsuario, string passwordActual, string passwordNueva)
{

    var usuario = await _context.Usuarios
        .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);

    if (usuario == null)
        return false;

  
    var hasher = new PasswordHasher<Usuario>();


    var verificacion = hasher.VerifyHashedPassword(null!, usuario.Passw, passwordActual);

    if (verificacion == PasswordVerificationResult.Failed)
        return false; 

    
    var nuevaPassHash = hasher.HashPassword(null!, passwordNueva);

  
    var p1 = new SqlParameter("@idUsuario", idUsuario);
    var p2 = new SqlParameter("@passw", nuevaPassHash);

    var filas = await _context.Database
        .ExecuteSqlRawAsync("EXEC passwUsuario @idUsuario, @passw", p1, p2);

    return filas > 0;
}




        // Eliminar usuario
        public async Task<int> EliminarUsuarioAsync(int id)
        {
            var param = new SqlParameter("@id", id);
            var result = await _context.Database
                .SqlQueryRaw<int>("EXEC eliminarUsuario @id", param)
                .FirstOrDefaultAsync();

            return result; 
        }
    }
}
