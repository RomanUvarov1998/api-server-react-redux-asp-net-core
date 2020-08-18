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
    // [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        public HomeController(MyContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("home/patients")]
        public IEnumerable<PatientVM> GetPatients()
        {
            List<Patient> ps = dbContext.Patients
                .Include(p => p.Fields)
                .ThenInclude(f => f.Name)
                .ToList();

            return ps
                .Select(p => new PatientVM(p))
                .ToList();
        }

        [HttpGet("home/template")]
        public PatientVM GetTemplate()
        {
            List<FieldName> fns = dbContext.FieldNames.ToList();
                
            PatientVM pvm = PatientVM.CreateEmpty(fns);

            return pvm;
        }

        private MyContext dbContext;
    }
}