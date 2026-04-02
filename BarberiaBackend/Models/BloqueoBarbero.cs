using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarberiaBackend.Models
{
     [Table("Bloqueo_Barbero")]
    public class BloqueoBarbero
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }
        [Required]
        public string Motivo { get; set; }
    }
}
