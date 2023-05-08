using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{

    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;    // sadece okunabilen private bir kayıt tutma özelliği oluşturuldu.


        public HomeController(ILogger<HomeController> logger)  // constructor tanımlandı. ILogger parametre olarak çağırıldı.
                                                               // uygulama faaliyetlerinin kaydı tutma ve izlmek için
        {
            _logger = logger;
        }

        public IActionResult Index()       // uygulamada ana sayfayı gösterir .
        {
            return View();
        }

        public IActionResult Privacy()  // kullanıcıya gizlilik politikası hakkında bilgi döndürür.
        {
            return View();
        }

        public IActionResult Error()    // hata durumda bir sayfa gösterir.
        {
            return View(new Errors
            {
                IdRequest = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
    }
}