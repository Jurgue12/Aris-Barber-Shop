using Microsoft.EntityFrameworkCore;
using BarberiaBackend.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace BarberiaBackend.Data
{
    public class BarberiaContext : DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public BarberiaContext(DbContextOptions<BarberiaContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("ConexionSQL");
        }

        // Tablas principales
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Servicio> Servicios { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<Administrador> Administradores { get; set; }
        public DbSet<BloqueoBarbero> BloqueosBarbero { get; set; }
        public DbSet<ConfigSistema> ConfigSistema { get; set; }
        public DbSet<ResultadoRegistro> ResultadoRegistro { get; set; }


   
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>().ToTable("cliente");
            modelBuilder.Entity<Usuario>().ToTable("usuario");
            modelBuilder.Entity<Servicio>().ToTable("servicio");
            modelBuilder.Entity<Cita>().ToTable("cita");
            modelBuilder.Entity<Administrador>().ToTable("administrador");
            modelBuilder.Entity<BloqueoBarbero>().ToTable("Bloqueo_Barbero");
            modelBuilder.Entity<ConfigSistema>().ToTable("Config_Sistema");
            modelBuilder.Entity<ResultadoRegistro>().HasNoKey();
        }

        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_connectionString);
            }
        }

    
        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
