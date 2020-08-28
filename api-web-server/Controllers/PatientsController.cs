using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
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
    [Route("patients")]
    public class PatientsController : ControllerBase
    {
        public PatientsController(MyContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("list")]
        public IEnumerable<PatientVM> GetPatients()
        {
            List<Patient> ps = Patient
                .IncludeFields(dbContext.Patients)
                .OrderBy(p => p.CreatedDate)
                .ToList();

            return ps
                .Select(p => new PatientVM(p))
                .ToList();
        }

        [HttpGet("template")]
        public PatientVM GetTemplate()
        {
            List<FieldName> fns = dbContext.FieldNames.ToList();

            PatientVM pvm = PatientVM.CreateEmpty(fns);

            return pvm;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add()
        {
            PatientVM patientVM = await TryReadPatient();

            if (patientVM.Status != Status.Added) return BadRequest("Status must be Added (0)");

            List<FieldName> existingFieldNames = dbContext.FieldNames.ToList();
            Patient patient = new Patient();
            patientVM.UpdateModel(patient, existingFieldNames);
            dbContext.Patients.Add(patient);

            // save changes and update 'patient.Id' according to database 
            dbContext.SaveChanges(true);
            patientVM.UpdateDatabaseId(patient);

            return Ok(patientVM);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update()
        {
            PatientVM patientVM = await TryReadPatient();

            if (patientVM.Status != Status.Modified) return BadRequest();

            List<FieldName> existingFieldNames = dbContext.FieldNames.ToList();
            Patient patient = dbContext.Patients
                .Include(p => p.Fields)
                .ThenInclude(f => f.Name)
                .FirstOrDefault(p => p.Id == patientVM.Id);

            if (patient == null) return NotFound();

            patientVM.UpdateModel(patient, existingFieldNames);

            dbContext.SaveChanges(true);

            return Ok(patientVM);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete()
        {
            PatientVM patientVM = await TryReadPatient();

            if (patientVM.Status != Status.Deleted) return BadRequest();

            Patient patient = dbContext.Patients
                .FirstOrDefault(p => p.Id == patientVM.Id);

            if (patient == null) return NotFound();

            dbContext.Patients.Remove(patient);

            dbContext.SaveChanges();

            return Ok(patient.Id);
        }

        [HttpPost("list")]
        public async Task<IActionResult> Some(int skip, int take)
        {
            if (skip < 0) return BadRequest("skip must be >= 0");
            if (take < 0) return BadRequest("take must be >= 0");

            var template = await TryReadPatient();

            var query = Patient
                .IncludeFields(dbContext.Patients);

            foreach (var field in template.Fields)
            {
                string trimmedValue = field.Value.Trim();

                if (string.IsNullOrEmpty(trimmedValue)) continue;

                query = query
                    .Where(p => p.Fields.Any(
                        f => 
                            f.Name.Id == field.NameId &&
                            f.Value.ToLower().StartsWith(trimmedValue.ToLower())
                    ));
            }

            var patients = query
                .OrderBy(p => p.CreatedDate)
                .Skip(skip)
                .Take(take)
                .ToList();

            // string filter = template.Fields[0].Value.ToLower();

            // var patientIds = dbContext.PatientFields
            //     .Where(f =>
            //         f.NameId == 1 &&
            //         f.Value.ToLower().StartsWith(filter)
            //     ).Select(f => f.PatientId)
            //     .Distinct()
            //     .OrderBy(id => id)
            //     .Skip(skip)
            //     .Take(take)
            //     .ToArray();

            // var patients = new List<Patient>();
            // foreach (var id in patientIds) {
            //     patients.Add(
            //         Patient
            //             .IncludeFields(dbContext.Patients)
            //             .First(p => p.Id == id)
            //     );
            // }

            var patientsVM = patients
                .Select(p => new PatientVM(p))
                .ToList();

            return Ok(patientsVM);
        }

        private async Task<PatientVM> TryReadPatient()
        {
            HttpRequest request = this.Request;
            StreamReader stream = new StreamReader(request.Body);
            string json = await stream.ReadToEndAsync();

            PatientVM patientVM = JsonConvert
                .DeserializeObject<PatientVM>(json);

            return patientVM;
        }

        private readonly MyContext dbContext;
    }
}