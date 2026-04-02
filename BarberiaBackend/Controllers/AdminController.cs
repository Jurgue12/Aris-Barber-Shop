using BarberiaBackend.AuthServices;
using BarberiaBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace BarberiaBackend.Controllers
{

     [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _service;

        public AdminController(AdminService service)
        {
            _service = service;
        }

        [HttpGet("read")]
        public async Task<IActionResult> Read()
        {
            var admins = await _service.ReadAsync();
            return Ok(admins);
        }


        [HttpGet("/{id}")]
        public async Task<IActionResult> Buscar(int id)
        {
            var admin = await _service.BuscarAsync(id);

            if (admin == null)
                return NotFound(new { mensaje = "Administrador no encontrado." });

            return Ok(admin);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Administrador admin)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { mensaje = "Datos inválidos." });

            var result = await _service.CreateAsync(admin);

            if (result.existeId)
                return Conflict(new { mensaje = "El ID de administrador ya está en uso." });

            if (result.existeCorreo)
                return Conflict(new { mensaje = "El correo ya está siendo utilizado." });

            return Ok(new
            {
                mensaje = "Administrador creado correctamente.",
                idGenerado = result.idGenerado
            });
        }



[HttpPut("edit/{id}")]
public async Task<IActionResult> Edit(int id, [FromBody] Administrador admin)
{
    if (!ModelState.IsValid)
        return BadRequest(new { mensaje = "Datos inválidos." });

    admin.Id = id;

    var resp = await _service.EditAsync(admin);

    return resp switch
    {
        1 => NotFound(new { mensaje = "El administrador no existe." }),
        2 => Conflict(new { mensaje = "El correo ya está en uso." }),
        0 => Ok(new { mensaje = "Administrador actualizado correctamente." }),
        _ => BadRequest(new { mensaje = "No se pudo actualizar el administrador." })
    };
}

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var resp = await _service.DeleteAsync(id);

            return resp switch
            {
                1 => NotFound(new { mensaje = "El administrador no existe." }),
                0 => Ok(new { mensaje = "Administrador eliminado correctamente." }),
                _ => BadRequest(new { mensaje = "No se pudo eliminar el administrador." })
            };
        }
    }
}
