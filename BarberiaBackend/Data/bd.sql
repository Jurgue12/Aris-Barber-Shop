CREATE DATABASE APP_BARBERIA

USE APP_BARBERIA;




-- Tabla: usuario
create table usuario (
    id int identity(1,1) primary key,
    idUsuario varchar(15) not null,
    correo varchar(100) not null,
    rol int not null,
    passw varchar(255) not null,
    ultimoAcceso datetime null,
	no_show_count int null,  --cuántas veces no se presentó a la cita
	late_cancel_count int null, --cancelaciones tardías acumuladas
	blocked_until datetime null, --echa hasta la que no puede reservar (por mal comportamiento, deuda, etc.).
    tkRef varchar(255) null,
    constraint UQ_usuario_idUsuario unique (idUsuario)
);

drop table cliente
-- Tabla: cliente
create table cliente (
    id int identity(1,1) primary key,
    idCliente varchar(15) not null,
	idUsuario varchar(15) NOT NULL UNIQUE,
    nombre varchar(30) not null,
    apellido1 varchar(15) not null,
    apellido2 varchar(15) not null,
    celular varchar(9) null,
    correo varchar(100) not null,
    fechaIngreso datetime default getdate(),
	CONSTRAINT FK_cliente_usuario FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
    constraint UQ_cliente_idCliente unique (idCliente),
    constraint UQ_cliente_correo unique (correo)
);


-- Tabla: servicio
create table servicio (
    idServicio int identity(1,1) primary key,
    nombre varchar(50) not null,
    descripcion varchar(255) null,
    duracion int not null,  -- minutos
	buffer_min int null,  --minutos de colchón antes/después (limpieza, setup); evita solapes
    precio decimal(10,2) not null,
    categoria varchar(50) null
);



-- Tabla: cita
create table cita (
    id int identity(1,1) primary key,
    idUsuario varchar(15) not null,
    idServicio int not null,
    fechaHora datetime not null,
	fin datetime null,  --tiempo estimado; se calcula con duracion + buffer_min o se guarda al cerrar.
    estado varchar(20) default 'pendiente' check (estado in ('pendiente', 'confirmada', 'rechazada', 'cancelada')),
	confirmada_en datetime null,--cuándo se confirmó (clic del admin/barbero o auto-confirmación).
	creado_en datetime null,--timestamp de creación
	motivo_cancelacion varchar(80),--razón visible en historial/soporte (p.ej. “cliente no llegará”).
    constraint FK_cita_usuario foreign key (idUsuario)
        references usuario(idUsuario),
    constraint FK_cita_servicio foreign key (idServicio)
        references servicio(idServicio)
);



-- Tabla: administrador
create table administrador (
    id int identity(1,1) primary key,
    idAdministrador varchar(15) not null,
    nombre varchar(30) not null,
    apellido1 varchar(15) not null,
    apellido2 varchar(15) not null,
    telefono varchar(9) not null,
    celular varchar(9) null,
    correo varchar(100) not null,
    fechaIngreso datetime default getdate(),
    constraint UQ_admin_idAdministrador unique (idAdministrador),
    constraint UQ_admin_correo unique (correo)
);




-- 6. Tabla: Bloqueo_Barbero
create table Bloqueo_Barbero (
    ID int identity(1,1) primary key,
    Inicio datetime not null,--rango de tiempo no reservable (vacaciones, mantenimiento, capacitación).
    Fin datetime not null,
    Motivo varchar(120)
);



-- 7. Tabla: Config_Sistema
create table Config_Sistema (
    ID int identity(1,1) primary key,
    confirmacion_auto_cancel_horas int,--si una cita no se confirma X horas antes, cancelarla automáticamente.
    reserva_anticipacion_min_horas int,--cuántas horas mínimas antes se puede reservar (evita citas “de última hora”).
    cancelacion_anticipacion_min_horas int,--límite para permitir cancelar sin penalización.
    gracia_min int,--minutos de tolerancia al llegar tarde antes de marcar no-show/cancelación.
    espera_puerta_min int--tiempo que esperás en recepción antes de liberar el slot o notificar.
);

