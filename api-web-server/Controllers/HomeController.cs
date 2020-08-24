using System.Net.Cache;
using System.Collections.Generic;
using System.Linq;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using database;
using database.Models;
using api_web_server.ViewModels;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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

        [HttpPost("home/savepatientchanges")]
        public async Task<IActionResult> SavePatientChange()
        {
            HttpRequest request = this.Request;
            StreamReader stream = new StreamReader(request.Body);
            string json = await stream.ReadToEndAsync();

            PatientVM patientVM = JsonConvert
                .DeserializeObject<PatientVM>(json);

            List<FieldName> existingFieldNames;
            Patient patient;

            switch (patientVM.Status)
            {
                case Status.Added:
                    existingFieldNames = dbContext.FieldNames.ToList();
                    patient = new Patient();
                    patientVM.UpdateModel(patient, existingFieldNames);
                    dbContext.Patients.Add(patient);
                    break;
                case Status.Modified:
                    existingFieldNames = dbContext.FieldNames.ToList();
                    patient = dbContext.Patients
                        .Include(p => p.Fields)
                        .ThenInclude(f => f.Name)
                        .FirstOrDefault(p => p.Id == patientVM.DatabaseId);

                    if (patient == null) return NotFound();

                    patientVM.UpdateModel(patient, existingFieldNames);
                    break;
                case Status.Deleted:
                    patient = dbContext.Patients
                        .FirstOrDefault(p => p.Id == patientVM.DatabaseId);

                    if (patient == null) return NotFound();

                    dbContext.Patients.Remove(patient);
                    break;
            }

            dbContext.SaveChanges();

            return Ok();
        }

        private readonly MyContext dbContext;
    }
}