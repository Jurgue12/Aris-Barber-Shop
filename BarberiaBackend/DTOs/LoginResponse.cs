namespace BarberiaBackend.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public DateTime Expira { get; set; }

        public int UsuarioId { get; set; }
        public int Rol { get; set; }
        public string RefreshToken { get; set; }
        public string Nombre { get; set; } 
    }
}
