using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using database;
using database.Models;
using api_web_server.ViewModels;
using System.Linq;

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
            List<Patient> ps = dbContext.Patients.ToList();
            return PatientVM.GetList(ps);
        }

        private MyContext dbContext;
    }
}