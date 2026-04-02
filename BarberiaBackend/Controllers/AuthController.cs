using BarberiaBackend.AuthServices;
using BarberiaBackend.DTOs;
using BarberiaBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarberiaBackend.Data;
using Microsoft.Extensions.Configuration;

namespace BarberiaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly BarberiaContext _context;
        private readonly IConfiguration _config;

        public AuthController(AuthService authService, BarberiaContext context, IConfiguration config)
        {
            _authService = authService;
            _context = context;
            _config = config;
        }

       
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.ValidateUserWithNameAsync(request.IdUsuario, request.Password);
            if (result == null) return Unauthorized(new { error = "Credenciales inválidas" });

            var (usuario, nombre) = result.Value;

            var token = _authService.GenerateJwtToken(usuario, nombre);
            var refresh = await _authService.GenerateRefreshTokenAsync(usuario);

            var respuesta = new LoginResponse
            {
                Token = token,
                Expira = DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                UsuarioId = usuario.Id,
                Rol = usuario.Rol,
                RefreshToken = refresh,
                Nombre = usuario.IdUsuario
            };

            return Ok(respuesta);
        }

   
        [HttpPost("logout/{idUsuario}")]
        public async Task<IActionResult> Logout(string idUsuario)
        {
            await _authService.LogoutAsync(idUsuario);
            return Ok(new { mensaje = "Sesión cerrada correctamente" });
        }

[HttpPost("register")]
public async Task<IActionResult> Registrar([FromBody] RegisterRequest request)
{
    var resultado = await _authService.RegistrarClientesAsync(request);

    if (!resultado.Exito)
    {
        return BadRequest(new {
            mensaje = resultado.Mensaje
        });
    }

    return Ok(new {
        mensaje = "Usuario registrado correctamente."
    });
}




        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] dynamic body)
        {
            string idUsuario = body.idUsuario;
            string refreshToken = body.refreshToken;

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);
            if (usuario == null) return Unauthorized(new { error = "Usuario no encontrado" });

            string nombre = usuario.Rol == 1
                ? "Barbero"
                : usuario.Cliente?.Nombre ?? "Cliente";

            var result = await _authService.RefreshTokenAsync(idUsuario, refreshToken, nombre);
            if (result == null) return Unauthorized(new { error = "Refresh Token inválido" });

            return Ok(new
            {
                token = result.Value.newToken,
                refreshToken = result.Value.newRefresh
            });
        }
    }
}
