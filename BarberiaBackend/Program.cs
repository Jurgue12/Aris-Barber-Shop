using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BarberiaBackend.Data;
using BarberiaBackend.AuthServices;
using Microsoft.EntityFrameworkCore;
using BarberiaBackend.Services;
using BarberiaBackend.Models;
using Microsoft.AspNetCore.Identity;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------------------------------------------------------
// 🔹 CORS para permitir Angular
// -----------------------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// -----------------------------------------------------------------------------
// 🔹 Configuración de SQL Server
// -----------------------------------------------------------------------------
builder.Services.AddDbContext<BarberiaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConexionSQL")));
    


// -----------------------------------------------------------------------------
// 🔹 Servicios personalizados
// -----------------------------------------------------------------------------
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UsuariosService>();
builder.Services.AddScoped<ClienteSPService>();
builder.Services.AddScoped<ServiciosService>();
builder.Services.AddScoped<CitasService>();
builder.Services.AddScoped<ReglaConfiguracion>();
builder.Services.AddScoped<ReglaBloqueo>();
builder.Services.AddScoped<ValidacionesGenerales>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<BloqueoService>();



// -----------------------------------------------------------------------------
// 🔹 Controllers, Authorization y Swagger
// -----------------------------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddOpenApi();

// -----------------------------------------------------------------------------
// 🔹 JWT
// -----------------------------------------------------------------------------
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audiense"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});



// -----------------------------------------------------------------------------
// 🔹 Construir App
// -----------------------------------------------------------------------------
var app = builder.Build();

// -----------------------------------------------------------------------------
// 🔹 Verificar conexión
// -----------------------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BarberiaContext>();

    try
    {
        context.Database.OpenConnection();
        Console.WriteLine("✅ Conexión exitosa a SQL Server.");
        context.Database.CloseConnection();
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ Error de conexión: " + ex.Message);
    }
   
    
}

// -----------------------------------------------------------------------------
// 🔹 Pipeline HTTP
// -----------------------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
