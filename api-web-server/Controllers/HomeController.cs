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

            await Task.Run(() => Thread.Sleep(1000));

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
                        .First(p => p.Id == patientVM.DatabaseId);
                    patientVM.UpdateModel(patient, existingFieldNames);
                    break;
                case Status.Deleted:
                    patient = dbContext.Patients
                        .First(p => p.Id == patientVM.DatabaseId);
                    dbContext.Patients.Remove(patient);
                    break;
            }

            dbContext.SaveChanges();

            return Ok();
        }

        [HttpPost("home/savechanges")]
        public async Task<List<PatientVM>> SaveChanges(
                    // [FromBody] IEnumerable<PatientVM> patientsToSave
                    )
        {
            HttpRequest request = this.Request;
            StreamReader stream = new StreamReader(request.Body);
            string json = await stream.ReadToEndAsync();

            PatientListChangesVM changes = JsonConvert
                .DeserializeObject<PatientListChangesVM>(json);

            IEnumerable<PatientVM> patientsToSave =
                changes.PatientsToSave
                ?? throw new Exception("null list");
            IEnumerable<int> idsToDelete =
                changes.IdsToDelete
                ?? throw new Exception("null list");

            List<FieldName> existingFieldNames = dbContext.FieldNames.ToList();

            foreach (PatientVM patientVM in patientsToSave)
            {
                List<FieldName> fieldNames = dbContext.FieldNames.ToList();

                Patient existingPatient;

                if (patientVM.DatabaseId > 0)
                {
                    existingPatient = dbContext.Patients
                        .Include(p => p.Fields)
                        .ThenInclude(f => f.Name)
                        .FirstOrDefault(p => p.Id == patientVM.DatabaseId);

                    if (existingPatient == null)
                        throw new Exception($"Couldn't find patient {patientVM.DatabaseId}");
                }
                else
                {
                    existingPatient = new Patient();
                    dbContext.Patients.Add(existingPatient);
                }

                if (patientVM.UpdateModel(existingPatient, existingFieldNames))
                {
                    dbContext.SaveChanges();
                }
            }

            foreach (int idToDelete in idsToDelete)
            {
                Patient patientToDelete = dbContext.Patients
                        .FirstOrDefault(p => p.Id == idToDelete);

                if (patientToDelete == null)
                    throw new Exception($"Couldn't find patient {idToDelete} to delete");

                dbContext.Patients.Remove(patientToDelete);

                dbContext.SaveChanges();
            }

            var refreshedPatients = dbContext.Patients
                .Include(p => p.Fields)
                .ThenInclude(f => f.Name)
                .ToList();

            return refreshedPatients
                .Select(p => new PatientVM(p))
                .ToList();
        }

        private MyContext dbContext;
    }
}