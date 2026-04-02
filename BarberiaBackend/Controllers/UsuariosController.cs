using BarberiaBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using BarberiaBackend.Models;
using BarberiaBackend.DTOs;

namespace BarberiaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly UsuariosService _usuariosService;
        private readonly PasswordHasher<Usuario> _hasher = new();

        public UsuariosController(UsuariosService usuariosService)
        {
            _usuariosService = usuariosService;
        }

        //  GET api/usuarios/5  o  api/usuarios?idUsuario=andres
        [HttpGet("{id?}")]
        public async Task<IActionResult> GetUsuario(int? id, [FromQuery] string? idUsuario)
        {
            var usuario = await _usuariosService.BuscarUsuarioAsync(id, idUsuario);
            if (usuario == null) return NotFound(new { mensaje = "Usuario no encontrado" });
            return Ok(usuario);
        }



[HttpPut("cambiar-password")]
public async Task<IActionResult> CambiarPassword([FromBody] CambiarPassRequest request)
{
    if (string.IsNullOrWhiteSpace(request.IdUsuario) ||
        string.IsNullOrWhiteSpace(request.PasswordActual) ||
        string.IsNullOrWhiteSpace(request.NuevaPassword))
    {
        return BadRequest(new { mensaje = "Faltan datos obligatorios" });
    }

    var ok = await _usuariosService.CambiarPasswordAsync(
        request.IdUsuario,
        request.PasswordActual,
        request.NuevaPassword
    );

    if (!ok)
        return BadRequest(new { mensaje = "La contraseña actual es incorrecta" });

    return Ok(new { mensaje = "Contraseña actualizada correctamente" });
}



        //Será necesario implementarlo?
        //  DELETE api/usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            var result = await _usuariosService.EliminarUsuarioAsync(id);
            if (result == 0) return NotFound(new { mensaje = "Usuario no encontrado" });
            return Ok(new { mensaje = "Usuario eliminado correctamente" });
        }
    }
}
