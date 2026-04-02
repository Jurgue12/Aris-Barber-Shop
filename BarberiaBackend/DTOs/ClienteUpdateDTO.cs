namespace BarberiaBackend.DTOs
{
    public class ClienteUpdateDTO
{
    public string IdCliente { get; set; }
    public string Nombre { get; set; }
    public string Apellido1 { get; set; }
    public string Apellido2 { get; set; }
    public string Correo { get; set; }
    public string? Celular { get; set; }
}
}
