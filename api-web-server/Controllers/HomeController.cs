using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using database;
using database.Models;
using api_web_server.ViewModels;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace api_web_server
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        public HomeController(MyContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IEnumerable<PatientVM> Index()
        {
            List<Patient> ps = dbContext.Patients
                .Include(p => p.Fields)
                .ThenInclude(f => f.Name)
                .ToList();
            return PatientVM.GetList(ps);
        }

        private MyContext dbContext;
    }
}