using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarberiaBackend.Models
{
    [Table("usuario")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string IdUsuario { get; set; }

        [Required]
        public string Correo { get; set; }

        [Required]
        public int Rol { get; set; }

        [Required]
        public string Passw { get; set; }

        public DateTime? UltimoAcceso { get; set; }

        public int? No_Show_Count { get; set; }

        public int? Late_Cancel_Count { get; set; }

        public DateTime? Blocked_until { get; set; }

        public string? TkRef { get; set; }

        public Cliente? Cliente { get; set; }
    }
}
