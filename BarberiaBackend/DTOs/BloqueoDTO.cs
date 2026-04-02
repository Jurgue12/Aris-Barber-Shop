namespace BarberiaBackend.DTOs
{
    public class BloqueoDTO
    {
        public int ID { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }
        public string? Motivo { get; set; }
    }
}
