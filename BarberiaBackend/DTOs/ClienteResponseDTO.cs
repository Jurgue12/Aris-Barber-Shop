namespace BarberiaBackend.DTOs
{
    public class ClienteResponseDTO
    {
        public int Id { get; set; }
        public string IdCliente { get; set; }
        public string IdUsuario { get; set; }

        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }

        public string Correo { get; set; }
        public string? Celular { get; set; }
        public DateTime FechaIngreso { get; set; }

        public string Usuario { get; set; }   // usuario login
    }
}
