using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarberiaBackend.Models
{
      [Table("Config_Sistema")]
    public class ConfigSistema
    {
        [Key]
        public int Id { get; set; }
        public int Confirmacion_Auto_Cancel_Horas { get; set; }
        public int Reserva_Anticipacion_Min_Horas { get; set; }
        public int Cancelacion_Anticipacion_Min_Horas { get; set; }
        public int Gracia_Min { get; set; }
        public int Espera_Puerta_Min { get; set; }
    }
}
