USE APP_BARBERIA;
GO

--------------------------------------------------------
-- sp_actualizar_estado_cita
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_actualizar_estado_cita;
GO
CREATE PROCEDURE sp_actualizar_estado_cita
    @p_id_cita INT,
    @p_estado VARCHAR(20)
AS
BEGIN
    UPDATE Cita
    SET Estado = @p_estado
    WHERE Id = @p_id_cita;
END;
GO


--------------------------------------------------------
-- sp_eliminar_cita
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_eliminar_cita;
GO
CREATE PROCEDURE sp_eliminar_cita
    @p_id_cita INT
AS
BEGIN
    DELETE FROM Cita
    WHERE Id = @p_id_cita;
END;
GO


--------------------------------------------------------
-- sp_nuevaCita
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_nuevaCita;
GO
CREATE PROCEDURE sp_nuevaCita
    @IdUsuario VARCHAR(15),
    @IdServicio INT,
    @FechaHora DATETIME,
    @resultado INT OUTPUT
AS
BEGIN
    DECLARE @conflicto INT;

    SELECT @conflicto = COUNT(*)
    FROM Cita
    WHERE ABS(DATEDIFF(MINUTE, FechaHora, @FechaHora)) < 30
      AND Estado IN ('pendiente', 'confirmada');

    IF @conflicto = 0
    BEGIN
        INSERT INTO Cita (
            IdUsuario,
            IdServicio,
            FechaHora,
            Fin,
            Estado,
            Creado_En,
            Motivo_Cancelacion
        )
        VALUES (
            @IdUsuario,
            @IdServicio,
            @FechaHora,
            DATEADD(MINUTE, 30, @FechaHora),
            'pendiente',
            GETDATE(),
            ''
        );

        SET @resultado = 0;
    END
    ELSE
    BEGIN
        SET @resultado = 1;
    END
END;
GO


--------------------------------------------------------
-- sp_listar_citas_por_cliente
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_listar_citas_por_cliente;
GO
CREATE PROCEDURE sp_listar_citas_por_cliente
    @p_id_usuario VARCHAR(15)
AS
BEGIN
    SELECT 
        c.Id,
        s.Nombre AS Servicio,
        c.FechaHora,
        c.Estado
    FROM Cita c
    INNER JOIN Servicio s ON c.IdServicio = s.IdServicio
    WHERE c.IdUsuario = @p_id_usuario
    ORDER BY c.FechaHora DESC;
END;
GO


--------------------------------------------------------
-- sp_listar_citas_del_dia
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_listar_citas_del_dia;
GO
CREATE PROCEDURE sp_listar_citas_del_dia
    @p_fecha DATE
AS
BEGIN
    SELECT 
        c.Id,
        cl.Nombre AS Cliente,
        s.Nombre AS Servicio,
        c.FechaHora,
        c.Estado
    FROM Cita c
    INNER JOIN Cliente cl ON c.IdUsuario = cl.IdUsuario
    INNER JOIN Servicio s ON c.IdServicio = s.IdServicio
    WHERE CAST(c.FechaHora AS DATE) = @p_fecha
    ORDER BY c.FechaHora;
END;
GO


--------------------------------------------------------
-- sp_horarios_ocupados
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_horarios_ocupados;
GO
CREATE PROCEDURE sp_horarios_ocupados
    @p_fecha DATE
AS
BEGIN
    SELECT FORMAT(FechaHora, 'HH:mm') AS Hora
    FROM Cita
    WHERE CAST(FechaHora AS DATE) = @p_fecha
      AND Estado IN ('pendiente', 'confirmada');
END;
GO


--------------------------------------------------------
-- sp_confirmar_cita
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_confirmar_cita;
GO
CREATE PROCEDURE sp_confirmar_cita
    @p_idCita INT
AS
BEGIN
    UPDATE Cita
    SET Estado = 'confirmada',
        Confirmada_En = GETDATE()
    WHERE Id = @p_idCita;
END;
GO


--------------------------------------------------------
-- sp_cancelar_cita
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_cancelar_cita;
GO
CREATE PROCEDURE sp_cancelar_cita
    @p_idCita INT
AS
BEGIN
    UPDATE Cita
    SET Estado = 'cancelada',
        Motivo_Cancelacion = ISNULL(Motivo_Cancelacion, 'Cancelada manualmente')
    WHERE Id = @p_idCita;
END;
GO


--------------------------------------------------------
-- sp_reprogramar_cita
--------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_reprogramar_cita;
GO
CREATE PROCEDURE sp_reprogramar_cita
    @p_id_cita INT,
    @p_nueva_fecha DATETIME,
    @resultado INT OUTPUT
AS
BEGIN
    DECLARE @IdUsuario VARCHAR(15);
    DECLARE @IdServicio INT;

    SELECT @IdUsuario = IdUsuario,
           @IdServicio = IdServicio
    FROM Cita
    WHERE Id = @p_id_cita;

    IF @IdUsuario IS NULL
    BEGIN
        SET @resultado = 2;
        RETURN;
    END;

    IF EXISTS (
        SELECT 1
        FROM Cita
        WHERE Id <> @p_id_cita
          AND ABS(DATEDIFF(MINUTE, FechaHora, @p_nueva_fecha)) < 30
          AND Estado IN ('pendiente', 'confirmada')
    )
    BEGIN
        SET @resultado = 1;
        RETURN;
    END;

    UPDATE Cita
    SET FechaHora = @p_nueva_fecha,
        Fin = DATEADD(MINUTE, 30, @p_nueva_fecha),
        Estado = 'pendiente'
    WHERE Id = @p_id_cita;

    SET @resultado = 0;
END;
GO



--------------------------------------------------------
-- buscarCita
--------------------------------------------------------
DROP PROCEDURE IF EXISTS buscarCita;
GO
CREATE PROCEDURE buscarCita
    @p_id INT
AS
BEGIN
    SELECT 
        c.*,
        s.Nombre AS Servicio
    FROM Cita c
    JOIN Servicio s ON s.IdServicio = c.IdServicio
    WHERE c.Id = @p_id;
END;
GO
