using BarberiaBackend.Models;
using BarberiaBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace BarberiaBackend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class ServicioController : ControllerBase
    {
        private readonly ServiciosService _serviciosService;


        public ServicioController(ServiciosService serviciosService)
        {
            _serviciosService = serviciosService;
        }

        //GET api/servicio
        [HttpGet]
        public async Task<IActionResult> GetServicios()
        {
            var servicios = await _serviciosService.ReadAsync();
            return Ok(servicios);
        }

        //GET api/servicio/2
        [HttpGet("{id}")]
        public async Task<IActionResult> GetServicio(int id)
        {
            var servicio = await _serviciosService.FiltrarAsync(id);
            if (servicio == null) return NotFound();
            return Ok(servicio);
        }

        //POST api/servicio
        [HttpPost]
        public async Task<IActionResult> CrearServicio([FromBody] Servicio servicio)
        {
            var nuevo = await _serviciosService.CreateAsync(servicio);
            return CreatedAtAction(nameof(GetServicio), new { id = nuevo.IdServicio }, nuevo);
        }

        //PUT api/servicio/2
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServicio(int id, [FromBody] Servicio servicio)
        {
            var actualizado = await _serviciosService.UpdateAsync(id, servicio);
            if (actualizado == null) return NotFound();
            return Ok(actualizado);
        }

        //DELETE api/servicio/2
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            var eliminado = await _serviciosService.DeleteAsync(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }




    }



}