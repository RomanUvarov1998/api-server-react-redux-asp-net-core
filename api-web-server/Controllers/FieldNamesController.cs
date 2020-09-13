using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using database;
using database.Models;
using api_web_server.DataTransferModels;
using api_web_server.ContextHelpers;
using api_web_server.Controllers.ActionFilters;
using System.Linq;

namespace api_web_server.Controllers
{
    [ApiController]
    [Route(Constants.ROUTE_CONTROLLER_FIELD_NAMES)]
    public class FieldNamesController : ControllerBase
    {
        public FieldNamesController(MyContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet(Constants.ROUTE_ACTION_GET_TEMPLATE)]
        public async Task<PatientSearchTemplateDTM> GetTemplate()
        {
            List<FieldName> fns = await _dbContext.FieldNames.ToListAsync();

            var searchTemplate = new PatientSearchTemplateDTM(fns);

            return searchTemplate;
        }

        [HttpPost(Constants.ROUTE_ACTION_SET_TEMPLATE)]
        public async Task<PatientSearchTemplateDTM> UpdateTemplate()
        {
            var updatedTemplate = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientSearchTemplateDTM>(this.Request.Body);

            var existingFieldNames = await _dbContext.FieldNames.ToListAsync();

            bool needSave = false;
            foreach (var updatedField in updatedTemplate.Fields)
            {
                if (updatedField.NameId > 0)
                {
                    var existingFN = existingFieldNames.FirstOrDefault(
                        fn => fn.Id == updatedField.NameId);

                    if (existingFN == null)
                    {
                        throw new MyException(
                            MyExceptionType.DoesNotExistInDatabase,
                            updatedField);
                    }

                    if (updatedField.UpdateModel(existingFN))
                    {
                        needSave = true;
                    }
                }
                else
                {
                    needSave = true;

                    _dbContext.FieldNames.Add(new FieldName(updatedField.Name));
                }
            }

            if (needSave)
            {
                await _dbContext.SaveChangesAsync();
            }

            List<FieldName> fns = await _dbContext.FieldNames.ToListAsync();
            var loadedTemplate = new PatientSearchTemplateDTM(fns);
            return loadedTemplate;
        }

        [HttpPost(Constants.ROUTE_ACTION_GET_VARIANTS)]
        public async Task<IActionResult> GetVariants(int fieldNameId, int maxCount)
        {
            var template = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientSearchTemplateDTM>(this.Request.Body);

            var fieldNames = await _dbContext.Patients
                .MyExt_GetFieldValuesForTemplate(template, fieldNameId, maxCount)
                .ToListAsync();

            return Ok(fieldNames);
        }


        private readonly MyContext _dbContext;
    }
}