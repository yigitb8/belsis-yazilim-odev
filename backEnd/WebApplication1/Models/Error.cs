using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class Errors
    {
        public string IdRequest { get; set; }

        // IdRequest boş ise = false(ShowIdRequest)
        //   dolu ise = true döner.

        public bool ShowIdRequest => !string.IsNullOrEmpty(IdRequest);
    }
}