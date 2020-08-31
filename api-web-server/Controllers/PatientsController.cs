using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using database;
using database.Models;
using api_web_server.DataTransferModels;
using api_web_server.ContextHelpers;

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
        public IEnumerable<PatientDTM> GetPatients()
        {
            List<Patient> ps = Patient
                .IncludeFields(dbContext.Patients)
                .OrderBy(p => p.CreatedDate)
                .ToList();

            return ps
                .Select(p => new PatientDTM(p))
                .ToList();
        }

        [HttpGet("template")]
        public PatientSearchTemplateDTM GetTemplate()
        {
            List<FieldName> fns = dbContext.FieldNames.ToList();

            var searchTemplate = new PatientSearchTemplateDTM(fns);

            return searchTemplate;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add()
        {
            var patientDTM = await ReadModelFromBodyAsync<PatientDTM>();

            if (patientDTM.Status != Status.Added) return BadRequest("Status must be Added (0)");

            List<FieldName> existingFieldNames = dbContext.FieldNames.ToList();
            Patient patient = new Patient();
            patientDTM.UpdateModel(patient, existingFieldNames);
            dbContext.Patients.Add(patient);

            // save changes and update 'patient.Id' according to database 
            dbContext.SaveChanges(true);
            patientDTM.UpdateDatabaseId(patient);

            return Ok(patientDTM);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update()
        {
            var patientDTM = await ReadModelFromBodyAsync<PatientDTM>();

            if (patientDTM.Status != Status.Modified) return BadRequest();

            List<FieldName> existingFieldNames = dbContext.FieldNames.ToList();
            Patient patient = dbContext.Patients
                .Include(p => p.Fields)
                .ThenInclude(f => f.Name)
                .FirstOrDefault(p => p.Id == patientDTM.Id);

            if (patient == null) return NotFound();

            patientDTM.UpdateModel(patient, existingFieldNames);

            dbContext.SaveChanges(true);

            return Ok(patientDTM);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete()
        {
            var patientDTM = await ReadModelFromBodyAsync<PatientDTM>();

            if (patientDTM.Status != Status.Deleted) return BadRequest();

            Patient patient = dbContext.Patients
                .FirstOrDefault(p => p.Id == patientDTM.Id);

            if (patient == null) return NotFound();

            dbContext.Patients.Remove(patient);

            dbContext.SaveChanges();

            return Ok(patient.Id);
        }

        [HttpPost("list")]
        public async Task<IActionResult> GetPortion(int skip, int take)
        {
            if (skip < 0) return BadRequest("skip must be >= 0");
            if (take < 0) return BadRequest("take must be >= 0");

            var template = await ReadModelFromBodyAsync<PatientSearchTemplateDTM>();

            var patients = MyContexthelper
                .GetPatientsByTemplate(dbContext, template, skip, take);

            var patientsDTM = patients
                .Select(p => new PatientDTM(p))
                .ToList();

            return Ok(patientsDTM);
        }

        [HttpPost("variants")]
        public async Task<IActionResult> GetVariants(int fieldNameId, int maxCount)
        {
            var template = await ReadModelFromBodyAsync<PatientSearchTemplateDTM>();

            var fieldNames = MyContexthelper
                .GetVariantsByTemplate(dbContext, template, fieldNameId, maxCount);

            return Ok(fieldNames);
        }

        private async Task<T> ReadModelFromBodyAsync<T>()
        {
            HttpRequest request = this.Request;
            StreamReader stream = new StreamReader(request.Body);
            string json = await stream.ReadToEndAsync();

            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.MissingMemberHandling = MissingMemberHandling.Error;

            T model = JsonConvert
                .DeserializeObject<T>(json, serializerSettings);

            return model;
        }

        private readonly MyContext dbContext;
    }
}