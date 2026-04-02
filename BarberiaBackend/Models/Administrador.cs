using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarberiaBackend.Models
{
    [Table("administrador")]
    public class Administrador
    {
        [Key]
        public int Id { get; set; }

        [Required]
     
        public string IdAdministrador { get; set; } = string.Empty;

        [Required]
      
        public string Nombre { get; set; } = string.Empty;

        [Required]
      
        public string Apellido1 { get; set; } = string.Empty;

        [Required]
    
        public string Apellido2 { get; set; } = string.Empty;

        [Required]
 
        public string Celular { get; set; }

        [Required]
   
        public string Correo { get; set; } = string.Empty;

        public DateTime FechaIngreso { get; set; } = DateTime.Now;
    }
}
