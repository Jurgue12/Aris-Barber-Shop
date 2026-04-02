namespace BarberiaBackend.DTOs
{
    public class BloqueoCreateDTO
    {
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }
        public string? Motivo { get; set; }
    }
}
