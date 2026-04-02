namespace BarberiaBackend.DTOs
{
    public class CambiarPassRequest
    {
        public string IdUsuario { get; set; }
        public string PasswordActual { get; set; }
        public string NuevaPassword { get; set; }
    }
}
