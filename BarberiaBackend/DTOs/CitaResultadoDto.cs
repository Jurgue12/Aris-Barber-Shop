namespace BarberiaBackend.DTOs
{
    public class CitaResultadoDto
    {
        // 0 = Cita creada correctamente, 1 = Conflicto de horario.
        public int Codigo { get; set; } 
        public string Mensaje { get; set; } = string.Empty;
    }
}