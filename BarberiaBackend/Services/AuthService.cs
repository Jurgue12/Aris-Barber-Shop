using BarberiaBackend.Data;
using BarberiaBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BarberiaBackend.DTOs;
using Microsoft.Data.SqlClient;

namespace BarberiaBackend.AuthServices
{
    public class AuthService
    {
        private readonly BarberiaContext _context;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<Usuario> _passwordHasher;

        public AuthService(BarberiaContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _passwordHasher = new PasswordHasher<Usuario>();
        }

        // 🔹 LOGIN - Validar usuario y contraseña
        public async Task<(Usuario usuario, string nombre)?> ValidateUserWithNameAsync(string idUsuario, string password)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario || u.Correo == idUsuario);

            if (usuario == null) return null;

            var resultado = _passwordHasher.VerifyHashedPassword(usuario, usuario.Passw, password);
            if (resultado != PasswordVerificationResult.Success)
                return null;

            string nombre;
            if (usuario.Rol == 1)
            {
                nombre = "Barbero";
            }
            else if (usuario.Rol == 2)
            {
                var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == usuario.Id);
                nombre = cliente?.Nombre ?? "Cliente";
            }
            else
            {
                nombre = "Usuario";
            }

            return (usuario, nombre);
        }

        // REGISTRO - Crear usuario y cliente
        
        public async Task<(bool Exito, string Mensaje)> RegistrarClientesAsync(RegisterRequest request)
        {
            try
            {
           
                var hasher = new PasswordHasher<Usuario>();
                var hashedPass = hasher.HashPassword(null!, request.Password);

                var p1 = new SqlParameter("@idUsuario", request.IdUsuario);
                var p2 = new SqlParameter("@correo", request.Correo);
                var p3 = new SqlParameter("@passw", hashedPass);
                var p4 = new SqlParameter("@nombre", request.Nombre);
                var p5 = new SqlParameter("@apellido1", request.Apellido1);
                var p6 = new SqlParameter("@apellido2", request.Apellido2 ?? (object)DBNull.Value);
                var p7 = new SqlParameter("@celular", request.Celular ?? (object)DBNull.Value);

                var resultado = _context.ResultadoRegistro
                .FromSqlRaw("EXEC registrarCliente @idUsuario, @correo, @passw, @nombre, @apellido1, @apellido2, @celular",
                p1, p2, p3, p4, p5, p6, p7)
                 .AsEnumerable()
                 .FirstOrDefault(); 

                return (resultado?.Resultado == 1, resultado?.Mensaje ?? "Error desconocido");
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        // 🔹 TOKEN - Guardar o actualizar tkRef (SP: modificarToken)
        public async Task ActualizarTokenAsync(string idUsuario, string tkRef)
        {
            var paramId = new SqlParameter("@idUsuario", idUsuario);
            var paramTk = new SqlParameter("@tkRef", tkRef);

            await _context.Database.ExecuteSqlRawAsync("EXEC modificarToken @idUsuario, @tkRef", paramId, paramTk);
        }

        // 🔹 TOKEN - Verificar refresh token (SP: verificarTokenR)
        public async Task<int?> VerificarTokenRefreshAsync(string idUsuario, string tkRef)
        {
            var paramId = new SqlParameter("@idUsuario", idUsuario);
            var paramTk = new SqlParameter("@tkRef", tkRef);

            var rol = await _context.Database
                .SqlQueryRaw<int>("EXEC verificarTokenR @idUsuario, @tkRef", paramId, paramTk)
                .FirstOrDefaultAsync();

            return rol;
        }


        // 🔹 JWT - Generar token de acceso
        public string GenerateJwtToken(Usuario usuario, string nombre)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.IdUsuario),
                new Claim("rol", usuario.Rol.ToString()),
                new Claim("nombre", nombre),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    
        // REFRESH TOKEN - Generar y guardar en BD
        public async Task<string> GenerateRefreshTokenAsync(Usuario usuario)
        {
            string refreshToken = Guid.NewGuid().ToString("N");
            await ActualizarTokenAsync(usuario.IdUsuario, refreshToken);
            return refreshToken;
        }

      
        // REFRESH TOKEN - Renovar tokens si es válido
        public async Task<(string newToken, string newRefresh)?> RefreshTokenAsync(string idUsuario, string refreshToken, string nombre)
        {
            var rol = await VerificarTokenRefreshAsync(idUsuario, refreshToken);
            if (rol == null) return null;

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);
            if (usuario == null) return null;

            string newJwt = GenerateJwtToken(usuario, nombre);
            string newRef = Guid.NewGuid().ToString("N");

            await ActualizarTokenAsync(idUsuario, newRef);

            return (newJwt, newRef);
        }

      
        // LOGOUT - Borrar token de sesión
        public async Task LogoutAsync(string idUsuario)
        {
            await ActualizarTokenAsync(idUsuario, "");
        }
    }
}
