using BarberiaBackend.DTOs;
using BarberiaBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace BarberiaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteSPService _service;

        public ClienteController(ClienteSPService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CrearSP(ClienteCreateDTO dto)
        {
            var result = await _service.NuevoCliente(dto);

            return result switch
            {
                1 => Ok(new { message = "Cliente creado correctamente" }),
                -1 => BadRequest(new { message = "El idCliente ya existe" }),
                -2 => BadRequest(new { message = "El correo ya existe" }),
                -3 => BadRequest(new { message = "El usuario ya tiene un cliente asociado" }),
                _   => StatusCode(500, new { message = "Error desconocido" })
            };
        }

        [HttpGet("BuscarCliente")]
        public async Task<IActionResult> BuscarCliente(int id, string idCliente)
        {
            var data = await _service.BuscarCliente(id, idCliente);
            return Ok(data);
        }

        [HttpGet("filtrar")]
        public async Task<IActionResult> Filtrar(string parametros, int pagina = 1, int cantRegs = 10)
        {
            var data = await _service.FiltrarCliente(parametros, pagina, cantRegs);
            return Ok(data);
        }

        [HttpGet("num")]
        public async Task<IActionResult> Contar(string parametros)
        {
            int total = await _service.NumRegsCliente(parametros);
            return Ok(new { total });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, ClienteUpdateDTO dto)
        {
            var result = await _service.EditarCliente(id, dto);

            return result switch
            {
                1 => Ok(new { message = "Cliente actualizado correctamente" }),
                0 => NotFound(new { message = "Cliente no existe" }),
                -1 => BadRequest(new { message = "El idCliente ya existe" }),
                -2 => BadRequest(new { message = "El correo ya existe" }),
                _ => StatusCode(500, new { message = "Error desconocido" })
            };
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var result = await _service.EliminarCliente(id);

            return result switch
            {
                1 => Ok(new { message = "Cliente eliminado" }),
                0 => NotFound(new { message = "Cliente no encontrado" }),
                _ => StatusCode(500, new { message = "Error desconocido" })
            };
        }
    }
}
