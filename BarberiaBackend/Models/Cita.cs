using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarberiaBackend.Models
{
  [Table("cita")]
    public class Cita
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string IdUsuario { get; set; }
        [Required]
        public int IdServicio { get; set; }
        [Column("fechaHora")]
        public DateTime FechaHora { get; set; }
          public DateTime Fin { get; set; }
        public string Estado { get; set; } = "pendiente";
        public DateTime? Confirmada_en { get; set; }
        public DateTime? Creado_en { get; set; }
        public string? Motivo_Cancelacion { get; set; }

   }
    }

