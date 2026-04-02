USE APP_BARBERIA;
GO

--------------------------------------------------------
-- sp_listar_servicios
--------------------------------------------------------
IF OBJECT_ID('sp_listar_servicios', 'P') IS NOT NULL
    DROP PROCEDURE sp_listar_servicios;  
GO

CREATE PROCEDURE sp_listar_servicios
AS
BEGIN
    SELECT 
        IdServicio AS Id,
        Nombre,
        Descripcion,
        Precio,
        Duracion,
        Categoria
    FROM Servicio;
END;
GO


--------------------------------------------------------
-- buscarServicio
--------------------------------------------------------
IF OBJECT_ID('buscarServicio', 'P') IS NOT NULL
    DROP PROCEDURE buscarServicio;
GO

CREATE PROCEDURE buscarServicio
    @Id INT
AS
BEGIN
    SELECT *
    FROM Servicio
    WHERE IdServicio = @Id;
END;
GO


--------------------------------------------------------
-- filtrarServicio
--------------------------------------------------------
IF OBJECT_ID('filtrarServicio', 'P') IS NOT NULL
    DROP PROCEDURE filtrarServicio;
GO

CREATE PROCEDURE filtrarServicio
    @parametros NVARCHAR(250),
    @pagina SMALLINT,
    @cantRegs SMALLINT
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);

    -- por ahora no hay filtros, solo paginación
    SET @sql = N'
        SELECT *
        FROM Servicio
        ORDER BY IdServicio
        OFFSET ' + CAST(@pagina AS NVARCHAR) + ' ROWS
        FETCH NEXT ' + CAST(@cantRegs AS NVARCHAR) + ' ROWS ONLY;
    ';

    EXEC sp_executesql @sql;
END;
GO


--------------------------------------------------------
-- numRegsServicio
--------------------------------------------------------
IF OBJECT_ID('numRegsServicio', 'P') IS NOT NULL
    DROP PROCEDURE numRegsServicio;
GO

CREATE PROCEDURE numRegsServicio
    @parametros NVARCHAR(250)
AS
BEGIN
    SELECT COUNT(IdServicio) AS total
    FROM Servicio;
END;
GO


--------------------------------------------------------
-- nuevoServicio
--------------------------------------------------------
IF OBJECT_ID('nuevoServicio', 'P') IS NOT NULL
    DROP PROCEDURE nuevoServicio;
GO

CREATE PROCEDURE nuevoServicio
    @Nombre NVARCHAR(50),
    @Descripcion NVARCHAR(255),
    @Duracion INT,
    @Precio DECIMAL(10,2),
    @Categoria NVARCHAR(50)
AS
BEGIN
    DECLARE @cant INT;

    SELECT @cant = COUNT(*) 
    FROM Servicio 
    WHERE Nombre = @Nombre;

    IF @cant = 0
    BEGIN
        INSERT INTO Servicio (Nombre, Descripcion, Duracion, Precio, Categoria)
        VALUES (@Nombre, @Descripcion, @Duracion, @Precio, @Categoria);
    END

    SELECT @cant AS yaExiste; 
END;
GO


--------------------------------------------------------
-- editarServicio
--------------------------------------------------------
IF OBJECT_ID('editarServicio', 'P') IS NOT NULL
    DROP PROCEDURE editarServicio;
GO

CREATE PROCEDURE editarServicio
    @Id INT,
    @Nombre NVARCHAR(50),
    @Descripcion NVARCHAR(255),
    @Duracion INT,
    @Precio DECIMAL(10,2),
    @Categoria NVARCHAR(50)
AS
BEGIN
    DECLARE @noEncontrado INT = 0;

    IF NOT EXISTS (SELECT 1 FROM Servicio WHERE IdServicio = @Id)
        SET @noEncontrado = 1;
    ELSE
        UPDATE Servicio
        SET 
            Nombre = @Nombre,
            Descripcion = @Descripcion,
            Duracion = @Duracion,
            Precio = @Precio,
            Categoria = @Categoria
        WHERE IdServicio = @Id;

    SELECT @noEncontrado AS noEncontrado; 
END;
GO


--------------------------------------------------------
-- eliminarServicio
--------------------------------------------------------
IF OBJECT_ID('eliminarServicio', 'P') IS NOT NULL
    DROP PROCEDURE eliminarServicio;
GO

CREATE PROCEDURE eliminarServicio
    @Id INT
AS
BEGIN
    DECLARE @cant INT;
    DECLARE @resp INT = 0;

    -- Existe el servicio?
    SELECT @cant = COUNT(*) 
    FROM Servicio 
    WHERE IdServicio = @Id;

    IF @cant > 0
    BEGIN
        -- Tiene citas asociadas?
        SELECT @cant = COUNT(*) 
        FROM Cita 
        WHERE IdServicio = @Id;

        IF @cant = 0
        BEGIN
            DELETE FROM Servicio WHERE IdServicio = @Id;
            SET @resp = 1; -- Eliminado
        END
        ELSE
            SET @resp = 2; -- No eliminado por tener citas
    END

    SELECT @resp AS resultado;
END;
GO
