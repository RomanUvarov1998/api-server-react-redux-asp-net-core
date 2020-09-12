using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using database;
using database.Models;
using api_web_server.DataTransferModels;
using api_web_server.ContextExtensions;

namespace api_web_server.Controllers
{
    [ApiController]
    [Route("patients")]
    public class PatientsController : ControllerBase
    {
        public PatientsController(MyContext dbContext)
        {
            this._dbContext = dbContext;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add()
        {
            var patientDTM = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientDTM>(this.Request.Body);

            List<FieldName> existingFieldNames = _dbContext.FieldNames.ToList();
            Patient patient = new Patient();
            patientDTM.UpdateModel(patient, existingFieldNames);
            _dbContext.Patients.Add(patient);

            // save changes and update 'patient.Id' according to database 
            _dbContext.SaveChanges(true);
            patientDTM.UpdateDatabaseId(patient);

            return Ok(patientDTM);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update()
        {
            var patientDTM = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientDTM>(this.Request.Body);

            List<FieldName> existingFieldNames = _dbContext.FieldNames.ToList();
            Patient patient = _dbContext.Patients
                .Include(p => p.Fields)
                .ThenInclude(f => f.Name)
                .FirstOrDefault(p => p.Id == patientDTM.Id);

            if (patient == null) return NotFound();

            patientDTM.UpdateModel(patient, existingFieldNames);

            _dbContext.SaveChanges(true);

            return Ok(patientDTM);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete()
        {
            var patientDTM = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientDTM>(this.Request.Body);

            Patient patient = _dbContext.Patients
                .FirstOrDefault(p => p.Id == patientDTM.Id);

            if (patient == null) return NotFound();

            _dbContext.Patients.Remove(patient);

            _dbContext.SaveChanges();

            return Ok(patient.Id);
        }

        [HttpPost("list")]
        public async Task<IActionResult> GetPortion(int skip, int take)
        {
            if (skip < 0) return BadRequest("skip must be >= 0");
            if (take < 0) return BadRequest("take must be >= 0");

            var template = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientSearchTemplateDTM>(this.Request.Body);

            var patients = _dbContext.Patients
                .MyExt_GetListByTemplate(template, skip, take);

            var patientsDTM = patients
                .Select(p => new PatientDTM(p))
                .ToList();

            return Ok(patientsDTM);
        }

        private readonly MyContext _dbContext;
    }
}