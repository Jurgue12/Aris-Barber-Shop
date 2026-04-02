USE APP_BARBERIA;
GO

--------------------------------------------------------
-- 1. PROCEDIMIENTO: verificarTokenR
--------------------------------------------------------
DROP PROCEDURE IF EXISTS verificarTokenR;
GO

CREATE PROCEDURE verificarTokenR
    @IdUsuario VARCHAR(100),
    @TkRef VARCHAR(255)
AS
BEGIN
    SELECT Rol
    FROM Usuario
    WHERE (IdUsuario = @IdUsuario OR Correo = @IdUsuario)
      AND TkRef = @TkRef;
END;
GO


--------------------------------------------------------
-- 2. PROCEDIMIENTO: modificarToken
--------------------------------------------------------
DROP PROCEDURE IF EXISTS modificarToken;
GO

CREATE PROCEDURE modificarToken
    @IdUsuario VARCHAR(100),
    @TkRef VARCHAR(255)
AS
BEGIN
    DECLARE @cant INT;

    -- Verificar existencia por IdUsuario o Correo
    SELECT @cant = COUNT(IdUsuario)
    FROM Usuario
    WHERE IdUsuario = @IdUsuario OR Correo = @IdUsuario;

    IF @cant > 0
    BEGIN
        -- Actualizar token
        UPDATE Usuario
        SET TkRef = @TkRef
        WHERE IdUsuario = @IdUsuario OR Correo = @IdUsuario;

        -- Actualizar fecha de último acceso
        IF LEN(@TkRef) > 0
        BEGIN
            UPDATE Usuario
            SET UltimoAcceso = GETDATE()
            WHERE IdUsuario = @IdUsuario OR Correo = @IdUsuario;
        END
    END

    SELECT @cant AS usuarios_actualizados;
END;
GO
