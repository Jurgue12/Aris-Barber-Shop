

using BarberiaBackend.Data;
using BarberiaBackend.Models;
using Microsoft.EntityFrameworkCore;

public class ReglaConfiguracion
{
    private readonly BarberiaContext _context;

    public ReglaConfiguracion(BarberiaContext context)
    {
        _context = context;
    }

 
    public async Task<ConfigSistema> ObtenerConfig()
    {
        return await _context.ConfigSistema.FirstAsync();
    }

    // Regla: Anticipación mínima para reservar
    public async Task<bool> CumpleReservaAnticipacion(DateTime fechaCita)
    {
        var config = await ObtenerConfig();
        return fechaCita >= DateTime.Now.AddHours(config.Reserva_Anticipacion_Min_Horas);
    }

    // Regla: Anticipación mínima para cancelar
    public async Task<bool> PuedeCancelar(DateTime fechaCita)
    {
        var config = await ObtenerConfig();
        return fechaCita >= DateTime.Now.AddHours(config.Cancelacion_Anticipacion_Min_Horas);
    }

    // Regla: Tiempo de gracia
    public async Task<bool> EnTiempoDeGracia(DateTime fechaCita)
    {
        var config = await ObtenerConfig();
        return DateTime.Now <= fechaCita.AddMinutes(config.Gracia_Min);
    }

    // Regla: Auto cancelación (si aplica)
    public async Task<bool> DebeAutoCancelar(DateTime fechaCita, string estado)
    {
        if (estado != "pendiente") return false;

        var config = await ObtenerConfig();
        return DateTime.Now >= fechaCita.AddHours(-config.Confirmacion_Auto_Cancel_Horas);
    }




}