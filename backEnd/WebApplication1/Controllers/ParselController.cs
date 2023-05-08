using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace WebApplication1.Controllers
{
    [Route("api/Parsel")]
    [ApiController]
    public class ParselController : ControllerBase
    {
        private AppDbContext _dbContext;

        public ParselController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("all")]
        public IActionResult GetAll()
        {
            var all = _dbContext.Parsel.ToList();
            return Ok(all);
        }

        [HttpPost]
        [Route("add")]
        public IActionResult AddParsel(Parsel parsel)
        {
            _dbContext.Parsel.Add(parsel);
            _dbContext.SaveChanges();
            return Ok(parsel.IdParsel);
        }

        [HttpPost]
        [Route("update")]
        public IActionResult UpdateParsel(Parsel parsel)
        {
            _dbContext.Update(parsel);
            _dbContext.SaveChanges();
            return NoContent();         //return true eklenebilir. 
        }


        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult DeleteGadget(int id)
        {
            var gadgetToDelete = _dbContext.Parsel.Where(p => p.IdParsel == id).FirstOrDefault();
            if (gadgetToDelete == null)   // tablodaki kayıtları filtre uygulayarak ParseId alanı id ile eşleşen kayıtları seçer.
            {                              // varsayılan değer ya da ilk değeri döndürür. Null dönerse 404 hatası alınır.
                return NotFound();  //404 error = NotFound    
            }

            _dbContext.Parsel.Remove(gadgetToDelete); //eleman varsa siler.
            _dbContext.SaveChanges(); // db yi kayıt eder          // Null değilse 204 yanıtı alınarak veritabanından silinir.
            return NoContent();  // 204 error= NoContent 

        }
    }
}