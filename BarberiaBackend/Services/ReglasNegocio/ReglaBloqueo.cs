using System;
using BarberiaBackend.Data;
using Microsoft.EntityFrameworkCore;

public class ReglaBloqueo
{
    private readonly BarberiaContext _context;


    public ReglaBloqueo(BarberiaContext context)
    {
        _context = context;
    }


    public async Task<bool> TieneTraslapeBloqueo(DateTime inicio, DateTime fin)
    {
        return await _context.BloqueosBarbero
            .AnyAsync(b =>
                (inicio >= b.Inicio && inicio < b.Fin) ||
                (fin > b.Inicio && fin <= b.Fin) ||
                (inicio <= b.Inicio && fin >= b.Fin)
            );
    }


   
public async Task<bool> TieneCitasEnRango(DateTime inicio, DateTime fin)
{
    return await _context.Citas
        .AnyAsync(c =>
            c.Estado == "confirmada" &&     
            (
                (inicio >= c.FechaHora && inicio < c.Fin) ||
                (fin > c.FechaHora && fin <= c.Fin) ||
                (inicio <= c.FechaHora && fin >= c.Fin)
            )
        );
}








}