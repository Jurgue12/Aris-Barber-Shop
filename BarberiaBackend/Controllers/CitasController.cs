using BarberiaBackend.Models;
using BarberiaBackend.Services;
using BarberiaBackend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BarberiaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private readonly CitasService _citasService;

        public CitasController(CitasService citasService)
        {
            _citasService = citasService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCita(int id)
        {
            var cita = await _citasService.FiltrarAsync(id);
            if (cita == null)
                return NotFound(new { mensaje = "La cita no existe." });

            return Ok(cita);
        }

        [HttpGet("cliente/{idUsuario}")]
        public async Task<IActionResult> Listar(string idUsuario)
        {
            var citas = await _citasService.ListarPorClienteAsync(idUsuario);
            return Ok(citas);
        }

        [HttpGet("dia/{fecha}")]
        public async Task<IActionResult> GetCitasDelDia(DateTime fecha)
        {
            var citas = await _citasService.ListarCitasDelDiaAsync(fecha);
            return Ok(citas);
        }

        [HttpGet("horarios-ocupados/{fecha}")]
        public async Task<IActionResult> GetHorariosOcupados(DateTime fecha)
        {
            var horarios = await _citasService.HorariosOcupadosAsync(fecha);
            return Ok(horarios);
        }

       // POST: Crear cita
[HttpPost]
public async Task<IActionResult> CrearCita([FromBody] Cita cita)
{
    var resultado = await _citasService.CrearAsync(cita);

    if (resultado.Codigo == 0)
    {
        return Ok(new
        {
            codigo = resultado.Codigo,
            mensaje = resultado.Mensaje
        });
    }

    return Conflict(new
    {
        codigo = resultado.Codigo,
        mensaje = resultado.Mensaje
    });
}

        [HttpPut("confirmar/{idCita}")]
        public async Task<IActionResult> ConfirmarCita(int idCita)
        {
            var success = await _citasService.ConfirmarAsync(idCita);

            if (!success)
                return NotFound(new { mensaje = "La cita no existe." });

            return NoContent();
        }

        [HttpPut("cancelar/{idCita}")]
        public async Task<IActionResult> CancelarCita(int idCita)
        {
            var success = await _citasService.CancelarAsync(idCita);

            if (!success)
                return NotFound(new { mensaje = "La cita no existe." });

            return NoContent();
        }

        // REPROGRAMAR cita
        [HttpPut("reprogramar/{id}")]
        public async Task<IActionResult> Reprogramar(int id, [FromBody] ReprogramarCitaDTO dto)
        {
            if (dto == null)
                return BadRequest(new { mensaje = "Debe enviar los datos de la cita." });

            var resultado = await _citasService.ReprogramarAsync(id, dto);

            if (resultado.Codigo == 0)
                return Ok(new { mensaje = resultado.Mensaje });

            return Conflict(new { mensaje = resultado.Mensaje });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCita(int id)
        {
            var eliminado = await _citasService.DeleteAsync(id);

            if (!eliminado)
                return NotFound(new { mensaje = "La cita no existe." });

            return NoContent();
        }
    }
}


// DTO Auxiliar para la solicitud de Reprogramación
namespace BarberiaBackend.Controllers
{
    public class ReprogramarCitaRequest
    {
        public DateTime NuevaFecha { get; set; }
    }
}