
using BarberiaBackend.Data;

public  class ValidacionesGenerales
{


    public ValidacionesGenerales(BarberiaContext context)
    {
       
    }
    public  void ValidarRango(DateTime inicio, DateTime fin)
    {
        if (inicio >= fin)
            throw new Exception("El inicio debe ser menor al fin.");
    }

    public  void ValidarFechaFutura(DateTime fecha)
    {
        if (fecha < DateTime.Now)
            throw new Exception("La hora seleccionada ya pasó.");
    }

    public  void ValidarTexto(string valor, string nombreCampo)
    {
        if (string.IsNullOrWhiteSpace(valor))
            throw new Exception($"{nombreCampo} es obligatorio.");
    }

    public  void ValidarId(int id, string nombreCampo = "ID")
    {
        if (id <= 0)
            throw new Exception($"{nombreCampo} es inválido.");
    }
}
