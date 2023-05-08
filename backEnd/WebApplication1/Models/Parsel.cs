using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class Parsel
    {
        // Parsele ait çeşitli sütunlar oluşturuldu.

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // id birbir artar.
        public int IdParsel { get; set; }
        public string IlParsel { get; set; }
        public string IlceParsel { get; set; }
        public string MahalleParsel { get; set; }
        public string Wkt { get; set; }
    }
}