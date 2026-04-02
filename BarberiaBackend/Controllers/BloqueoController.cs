using BarberiaBackend.DTOs;
using BarberiaBackend.Models;
using BarberiaBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace BarberiaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BloqueoController : ControllerBase
    {
        private readonly BloqueoService _bloqueoService;

        public BloqueoController(BloqueoService bloqueoService)
        {
            _bloqueoService = bloqueoService;
        }

      
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] BloqueoCreateDTO dto)
        {
            if (dto == null)
                return BadRequest(new { mensaje = "Debe enviar el bloqueo." });

            var resultado = await _bloqueoService.CrearAsync(dto);

            if (resultado.Resultado == 0)
                return Ok(new { mensaje = resultado.Mensaje });

            return Conflict(new { mensaje = resultado.Mensaje });
        }

     
        // GET api/bloqueo/2025-01-20
        [HttpGet("{fecha}")]
        public async Task<IActionResult> ListarPorFecha(DateTime fecha)
        {
            var lista = await _bloqueoService.ListarPorFechaAsync(fecha);
            return Ok(lista);
        }

      
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var resultado = await _bloqueoService.EliminarAsync(id);

            if (resultado.Resultado == 0)
                return Ok(new { mensaje = resultado.Mensaje });

            return Conflict(new { mensaje = resultado.Mensaje });
        }

        [HttpGet]
public async Task<IActionResult> ListarTodos()
{
    var lista = await _bloqueoService.ListarTodosAsync();
    return Ok(lista);
}

    }
}
