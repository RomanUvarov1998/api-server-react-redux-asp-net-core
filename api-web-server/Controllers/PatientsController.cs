using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using database;
using database.Models;
using api_web_server.DataTransferModels;
using api_web_server.ContextHelpers;
using api_web_server.Controllers.ActionFilters;

namespace api_web_server.Controllers
{
    [ApiController]
    [Route(Constants.ROUTE_CONTROLLER_PATIENTS)]
    public class PatientsController : ControllerBase
    {
        public PatientsController(MyContext dbContext)
        {
            this._dbContext = dbContext;
        }

        [HttpPost(Constants.ROUTE_ACTION_PATIENTS_ADD)]
        public async Task<PatientDTM> Add()
        {
            var patientDTM = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientDTM>(this.Request.Body);

            List<FieldName> existingFieldNames = await _dbContext.FieldNames.ToListAsync();

            var nonExisting = ControllerHelpers.FirstNonExistingOrDefault(
                patientDTM.Fields, existingFieldNames,
                (dtmF, mf) => dtmF.NameId == mf.Id);

            if (nonExisting != null)
            {
                throw new MyException(
                    MyExceptionType.DoesNotExistInDatabase,
                    nonExisting);
            }

            Patient patient = new Patient(
                existingFieldNames
                    .Select(fn => new PatientField(fn))
                    .ToArray());

            patientDTM.UpdateModel(patient);

            _dbContext.Patients.Add(patient);

            await _dbContext.SaveChangesAsync(true);
            patientDTM = new PatientDTM(patient);

            return patientDTM;
        }

        [HttpPost(Constants.ROUTE_ACTION_PATIENTS_UPDATE)]
        public async Task<PatientDTM> Update()
        {
            var patientDTM = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientDTM>(this.Request.Body);

            List<FieldName> existingFieldNames = await _dbContext.FieldNames.ToListAsync();

            var nonExisting = ControllerHelpers.FirstNonExistingOrDefault(
                patientDTM.Fields, existingFieldNames,
                (dtmF, mf) => dtmF.NameId == mf.Id);

            if (nonExisting != null)
            {
                throw new MyException(
                    MyExceptionType.DoesNotExistInDatabase,
                    nonExisting);
            }

            Patient patient = await _dbContext.Patients
                .IncludeFields()
                .FirstOrDefaultAsync(p => p.Id == patientDTM.Id);

            if (patient == null)
            {
                throw new MyException(
                    MyExceptionType.DoesNotExistInDatabase,
                    patientDTM);
            }

            patientDTM.UpdateModel(patient);

            await _dbContext.SaveChangesAsync(true);

            return patientDTM;
        }

        [HttpPost(Constants.ROUTE_ACTION_PATIENTS_DELETE)]
        public async Task<int> Delete()
        {
            var patientDTM = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientDTM>(this.Request.Body);

            Patient patient = await _dbContext.Patients.FindAsync(patientDTM.Id);

            if (patient == null)
            {
                throw new MyException(
                    MyExceptionType.DoesNotExistInDatabase,
                    patientDTM);
            }

            patient.IsDeleted = true;

            await _dbContext.SaveChangesAsync(true);

            return patient.Id;
        }

        [HttpPost(Constants.ROUTE_ACTION_PATIENTS_RESTORE)]
        public async Task<int> Restore()
        {
            var patientDTM = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientDTM>(this.Request.Body);

            Patient patient = await _dbContext.Patients.FindAsync(patientDTM.Id);

            if (patient == null)
            {
                throw new MyException(
                    MyExceptionType.DoesNotExistInDatabase,
                    patientDTM);
            }

            patient.IsDeleted = false;

            await _dbContext.SaveChangesAsync(true);

            return patient.Id;
        }

        [HttpPost(Constants.ROUTE_ACTION_PATIENTS_GET_LIST)]
        public async Task<List<PatientDTM>> GetPortion(int skip, int take)
        {
            var template = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientSearchTemplateDTM>(this.Request.Body);

            var patients = await _dbContext.Patients
                .MyExt_PortionByTemplate(template, skip, take)
                .ToListAsync();

            var patientsDTM = patients
                .Select(p => new PatientDTM(p))
                .ToList();

            return patientsDTM;
        }

        private readonly MyContext _dbContext;
    }
}