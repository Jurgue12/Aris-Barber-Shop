using System.ComponentModel.DataAnnotations;

namespace BarberiaBackend.DTOs
{
    public class RegisterRequest
    {
        // Datos del usuario
        public string IdUsuario { get; set; } = null!;
        [Required, EmailAddress]
        public string Correo { get; set; } = null!;
            [Required, MinLength(5)]
        public string Password { get; set; } = null!;

        // Datos del cliente
        public string Nombre { get; set; } = null!;
        public string Apellido1 { get; set; } = null!;
        public string Apellido2 { get; set; } = null!;
        public string Celular { get; set; } = null!;
    }
}
