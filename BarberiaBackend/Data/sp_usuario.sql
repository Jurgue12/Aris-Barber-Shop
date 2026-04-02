USE APP_BARBERIA;
GO

--------------------------------------------------------
-- 1. PROCEDIMIENTO: buscarUsuario
--------------------------------------------------------
DROP PROCEDURE IF EXISTS buscarUsuario;
GO
CREATE PROCEDURE buscarUsuario
    @Id INT,
    @IdUsuario VARCHAR(15)
AS
BEGIN
    SELECT * 
    FROM Usuario
    WHERE IdUsuario = @IdUsuario OR Id = @Id;
END;
GO


--------------------------------------------------------
-- 2. PROCEDIMIENTO: nuevoUsuario
--------------------------------------------------------
DROP PROCEDURE IF EXISTS nuevoUsuario;
GO
CREATE PROCEDURE nuevoUsuario
    @IdUsuario VARCHAR(15),
    @Correo VARCHAR(100),
    @Rol INT,
    @Passw VARCHAR(255)
AS
BEGIN
    DECLARE @cant INT;

    SELECT @cant = COUNT(Id)
    FROM Usuario
    WHERE IdUsuario = @IdUsuario;

    IF @cant = 0
    BEGIN
        INSERT INTO Usuario (IdUsuario, Correo, Rol, Passw)
        VALUES (@IdUsuario, @Correo, @Rol, @Passw);
    END;

    SELECT @cant AS existe;
END;
GO


--------------------------------------------------------
-- 3. PROCEDIMIENTO: eliminarUsuario
--------------------------------------------------------
DROP PROCEDURE IF EXISTS eliminarUsuario;
GO
CREATE PROCEDURE eliminarUsuario
    @Id INT
AS
BEGIN
    DECLARE @cant INT;

    SELECT @cant = COUNT(Id)
    FROM Usuario
    WHERE Id = @Id;

    IF @cant > 0
    BEGIN
        DELETE FROM Usuario WHERE Id = @Id;
    END;

    SELECT @cant AS eliminado;
END;
GO


--------------------------------------------------------
-- 4. PROCEDIMIENTO: rolUsuario
--------------------------------------------------------
DROP PROCEDURE IF EXISTS rolUsuario;
GO
CREATE PROCEDURE rolUsuario
    @IdUsuario VARCHAR(15),
    @Rol INT
AS
BEGIN
    UPDATE Usuario
    SET Rol = @Rol
    WHERE IdUsuario = @IdUsuario;
END;
GO


--------------------------------------------------------
-- 5. PROCEDIMIENTO: passwUsuario
--------------------------------------------------------
DROP PROCEDURE IF EXISTS passwUsuario;
GO
CREATE PROCEDURE passwUsuario
    @IdUsuario VARCHAR(320),
    @Passw VARCHAR(255)
AS
BEGIN
    UPDATE Usuario
    SET Passw = @Passw
    WHERE IdUsuario = @IdUsuario;
END;
GO



/* =======================================================
   6. PROCEDIMIENTO: registrarCliente  
   Corregido totalmente — PascalCase y FK bien usadas
   ======================================================= */
DROP PROCEDURE IF EXISTS registrarCliente;
GO
CREATE PROCEDURE registrarCliente
    @IdUsuario VARCHAR(50),
    @Correo VARCHAR(100),
    @Passw VARCHAR(255),
    @Nombre NVARCHAR(100),
    @Apellido1 NVARCHAR(100),
    @Apellido2 NVARCHAR(100),
    @Celular NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @existeUsuario INT, @existeCorreo INT;

    -- Validaciones de existencia
    SELECT @existeUsuario = COUNT(*) FROM Usuario WHERE IdUsuario = @IdUsuario;
    SELECT @existeCorreo = COUNT(*) FROM Usuario WHERE Correo = @Correo;

    IF (@existeUsuario > 0)
    BEGIN
        SELECT 0 AS resultado, 'El nombre de usuario ya existe' AS mensaje;
        RETURN;
    END;

    IF (@existeCorreo > 0)
    BEGIN
        SELECT 0 AS resultado, 'El correo ya está registrado' AS mensaje;
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Registrar usuario (ROL 2 = Cliente)
        INSERT INTO Usuario (
            IdUsuario,
            Correo,
            Rol,
            Passw,
            UltimoAcceso,
            No_Show_Count,
            Late_Cancel_Count,
            Blocked_Until,
            TkRef
        )
        VALUES (
            @IdUsuario,
            @Correo,
            2,
            @Passw,
            NULL,
            0,
            0,
            NULL,
            NULL
        );

        -- Generar IdCliente tipo CLI000X
        DECLARE @IdCliente VARCHAR(20);
        SET @IdCliente = CONCAT('CLI', RIGHT('000' + CAST((SELECT COUNT(*) FROM Cliente) + 1 AS VARCHAR(3)), 3));

        -- Registrar cliente (FK correcta → IdUsuario VARCHAR)
        INSERT INTO Cliente (
            IdCliente,
            IdUsuario,
            Nombre,
            Apellido1,
            Apellido2,
            Celular,
            Correo,
            FechaIngreso
        )
        VALUES (
            @IdCliente,
            @IdUsuario,
            @Nombre,
            @Apellido1,
            @Apellido2,
            @Celular,
            @Correo,
            GETDATE()
        );

        COMMIT TRANSACTION;
        SELECT 1 AS resultado, 'Cliente registrado correctamente' AS mensaje;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS resultado, ERROR_MESSAGE() AS mensaje;
    END CATCH
END;
GO
