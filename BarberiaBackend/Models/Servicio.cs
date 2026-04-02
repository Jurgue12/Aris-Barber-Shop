using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarberiaBackend.Models
{
        [Table("servicio")]
    public class Servicio
    {
        [Column("idServicio")]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int IdServicio { get; set; }
        [Required]
        public string Nombre { get; set; }
        [Required]
        public string Descripcion { get; set; }
        [Required]
        public int Duracion { get; set; }
        public int Buffer_min { get; set; }

        [Required]
        public decimal Precio { get; set; }
        [Required]
        public string Categoria { get; set; }

     
    }
}

