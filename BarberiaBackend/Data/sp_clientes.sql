USE APP_BARBERIA;
GO

--------------------------------------------------------
-- 1. PROCEDIMIENTO: buscarCliente
--------------------------------------------------------
DROP PROCEDURE IF EXISTS buscarCliente;
GO
CREATE PROCEDURE buscarCliente
    @Id INT,
    @IdCliente VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * 
    FROM Cliente
    WHERE IdCliente = @IdCliente OR Id = @Id;
END;
GO


--------------------------------------------------------
-- 2. PROCEDIMIENTO: filtrarCliente
--------------------------------------------------------
DROP PROCEDURE IF EXISTS filtrarCliente;
GO
CREATE PROCEDURE filtrarCliente
    @parametros VARCHAR(250),
    @pagina SMALLINT,
    @cantRegs SMALLINT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdCliente NVARCHAR(50),
            @Nombre NVARCHAR(50),
            @Apellido1 NVARCHAR(50),
            @Apellido2 NVARCHAR(50);

    DECLARE @tmp TABLE (param NVARCHAR(100));

    INSERT INTO @tmp SELECT value FROM STRING_SPLIT(@parametros, '&');

    SELECT 
        @IdCliente = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%IdCliente%'),
        @Nombre = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%Nombre%'),
        @Apellido1 = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%Apellido1%'),
        @Apellido2 = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%Apellido2%');

    SELECT *
    FROM Cliente
    WHERE 
        (@IdCliente IS NULL OR IdCliente LIKE @IdCliente) AND
        (@Nombre IS NULL OR Nombre LIKE @Nombre) AND
        (@Apellido1 IS NULL OR Apellido1 LIKE @Apellido1) AND
        (@Apellido2 IS NULL OR Apellido2 LIKE @Apellido2)
    ORDER BY Id
    OFFSET (@pagina - 1) * @cantRegs ROWS
    FETCH NEXT @cantRegs ROWS ONLY;
END;
GO


--------------------------------------------------------
-- 3. PROCEDIMIENTO: numRegsCliente
--------------------------------------------------------
DROP PROCEDURE IF EXISTS numRegsCliente;
GO
CREATE PROCEDURE numRegsCliente
    @parametros VARCHAR(250)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdCliente NVARCHAR(50),
            @Nombre NVARCHAR(50),
            @Apellido1 NVARCHAR(50),
            @Apellido2 NVARCHAR(50);

    DECLARE @tmp TABLE (param NVARCHAR(100));
    INSERT INTO @tmp SELECT value FROM STRING_SPLIT(@parametros, '&');

    SELECT 
        @IdCliente = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%IdCliente%'),
        @Nombre = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%Nombre%'),
        @Apellido1 = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%Apellido1%'),
        @Apellido2 = (SELECT TOP 1 param FROM @tmp WHERE param LIKE '%Apellido2%');

    SELECT COUNT(*) AS total
    FROM Cliente
    WHERE 
        (@IdCliente IS NULL OR IdCliente LIKE @IdCliente) AND
        (@Nombre IS NULL OR Nombre LIKE @Nombre) AND
        (@Apellido1 IS NULL OR Apellido1 LIKE @Apellido1) AND
        (@Apellido2 IS NULL OR Apellido2 LIKE @Apellido2);
END;
GO


--------------------------------------------------------
-- 4. PROCEDIMIENTO: nuevoCliente
--------------------------------------------------------
DROP PROCEDURE IF EXISTS nuevoCliente;
GO
CREATE PROCEDURE nuevoCliente
    @IdCliente VARCHAR(15),
    @IdUsuario VARCHAR(15),
    @Nombre VARCHAR(30),
    @Apellido1 VARCHAR(15),
    @Apellido2 VARCHAR(15),
    @Celular VARCHAR(9),
    @Correo VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validar IdCliente único
        IF EXISTS(SELECT 1 FROM Cliente WHERE IdCliente = @IdCliente)
        BEGIN
            SELECT -1 AS existe;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Validar Correo único
        IF EXISTS(SELECT 1 FROM Cliente WHERE Correo = @Correo)
        BEGIN
            SELECT -2 AS existe;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Validar IdUsuario no usado
        IF EXISTS(SELECT 1 FROM Cliente WHERE IdUsuario = @IdUsuario)
        BEGIN
            SELECT -3 AS existe;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        INSERT INTO Cliente (IdCliente, IdUsuario, Nombre, Apellido1, Apellido2, Celular, Correo)
        VALUES (@IdCliente, @IdUsuario, @Nombre, @Apellido1, @Apellido2, @Celular, @Correo);

        COMMIT TRANSACTION;
        SELECT 1 AS existe;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


--------------------------------------------------------
-- 5. PROCEDIMIENTO: editarCliente
--------------------------------------------------------
DROP PROCEDURE IF EXISTS editarCliente;
GO
CREATE PROCEDURE editarCliente
    @Id INT,
    @IdCliente VARCHAR(15),
    @Nombre VARCHAR(30),
    @Apellido1 VARCHAR(15),
    @Apellido2 VARCHAR(15),
    @Celular VARCHAR(9),
    @Correo VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar existencia del cliente
        IF NOT EXISTS(SELECT 1 FROM Cliente WHERE Id = @Id)
        BEGIN
            SELECT 0 AS actualizado;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Validar IdCliente único
        IF EXISTS(SELECT 1 FROM Cliente WHERE IdCliente = @IdCliente AND Id <> @Id)
        BEGIN
            SELECT -1 AS actualizado;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- Validar Correo único
        IF EXISTS(SELECT 1 FROM Cliente WHERE Correo = @Correo AND Id <> @Id)
        BEGIN
            SELECT -2 AS actualizado;
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        UPDATE Cliente
        SET 
            IdCliente = @IdCliente,
            Nombre = @Nombre,
            Apellido1 = @Apellido1,
            Apellido2 = @Apellido2,
            Celular = @Celular,
            Correo = @Correo
        WHERE Id = @Id;

        COMMIT TRANSACTION;
        SELECT 1 AS actualizado;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


--------------------------------------------------------
-- 6. PROCEDIMIENTO: eliminarCliente
--------------------------------------------------------
DROP PROCEDURE IF EXISTS eliminarCliente;
GO
CREATE PROCEDURE eliminarCliente
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @cant INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        SELECT @cant = COUNT(Id)
        FROM Cliente
        WHERE Id = @Id;

        IF @cant > 0
        BEGIN
            DELETE FROM Cliente WHERE Id = @Id;
        END;

        COMMIT TRANSACTION;
        SELECT @cant AS eliminado;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
