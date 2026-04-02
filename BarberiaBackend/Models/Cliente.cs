using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BarberiaBackend.Models
{
    [Table("cliente")]
    public class Cliente
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(15)]
        public string IdCliente { get; set; }

        [Required]
        public int IdUsuario { get; set; }  

        [Required]
        [MaxLength(30)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(15)]
        public string Apellido1 { get; set; }

        [Required]
        [MaxLength(15)]
        public string Apellido2 { get; set; }

        [MaxLength(9)]
        [RegularExpression("^[0-9]{8,9}$", ErrorMessage = "El celular debe contener solo números.")]
        public string? Celular { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Correo { get; set; }

        public DateTime FechaIngreso { get; set; } = DateTime.Now;

        [ForeignKey(nameof(IdUsuario))]
        [JsonIgnore] 
        public Usuario? Usuario { get; set; }
    }
}
