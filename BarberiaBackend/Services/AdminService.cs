using BarberiaBackend.Data;
using BarberiaBackend.Models;
using Dapper;

public class AdminService
{
    private readonly BarberiaContext _context;

    public AdminService(BarberiaContext context)
    {
        _context = context;
    }


    public async Task<List<Administrador>> ReadAsync()
    {
        using var connection = _context.CreateConnection();
        var query = "EXEC sp_listar_administradores";
        var result = await connection.QueryAsync<Administrador>(query);
        return result.ToList();
    }

    public async Task<Administrador?> BuscarAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var query = "EXEC buscarAdministrador @id";
        var result = await connection.QuerySingleOrDefaultAsync<Administrador>(query, new { id });
        return result;
    }

    public async Task<(bool existeId, bool existeCorreo, int idGenerado)> CreateAsync(Administrador admin)
    {
        using var connection = _context.CreateConnection();

        var query = "EXEC nuevoAdministrador @idAdministrador, @nombre, @apellido1, @apellido2, @celular, @correo";

        var parameters = new
        {
            idAdministrador = admin.IdAdministrador,
            nombre = admin.Nombre,
            apellido1 = admin.Apellido1,
            apellido2 = admin.Apellido2,
            celular = admin.Celular,
            correo = admin.Correo
        };

        var result = await connection.QueryFirstAsync<dynamic>(query, parameters);

        bool existeId = result.yaExisteId == 1;
        bool existeCorreo = result.yaExisteCorreo == 1;
        int idGenerado = result.idGenerado ?? 0;

        return (existeId, existeCorreo, idGenerado);
    }


    public async Task<int> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var query = "EXEC eliminarAdministrador @id";
        var result = await connection.QueryFirstAsync<int>(query, new { id });
        return result;
    }


    // EDITAR ADMINISTRADOR
public async Task<int> EditAsync(Administrador admin)
{
    using var connection = _context.CreateConnection();

    var query = "EXEC editarAdministrador @id, @idAdministrador, @nombre, @apellido1, @apellido2, @celular, @correo";

    var parameters = new
    {
        admin.Id,
        admin.IdAdministrador,
        admin.Nombre,
        admin.Apellido1,
        admin.Apellido2,
        admin.Celular,
        admin.Correo
    };

    var result = await connection.QueryFirstAsync<int>(query, parameters);

    return result;  
}

}
