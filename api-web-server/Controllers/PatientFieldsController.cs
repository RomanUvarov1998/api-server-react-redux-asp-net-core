using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using database;
using database.Models;
using api_web_server.DataTransferModels;
using api_web_server.ContextHelpers;

namespace api_web_server.Controllers
{
    [ApiController]
    [Route("patient_fields")]
    public class PatientFieldsController : ControllerBase
    {
        public PatientFieldsController(MyContext dbContext)
        {
            this.dbContext = dbContext;
        }
        
        [HttpGet("template")]
        public PatientSearchTemplateDTM GetTemplate()
        {
            List<FieldName> fns = dbContext.FieldNames.ToList();

            var searchTemplate = new PatientSearchTemplateDTM(fns);

            return searchTemplate;
        }

        // [HttpPost("template")]
        // public PatientSearch

        [HttpPost("variants")]
        public async Task<IActionResult> GetVariants(int fieldNameId, int maxCount)
        {
            var template = await ControllerHelpers
                .ReadModelFromBodyAsync<PatientSearchTemplateDTM>(this.Request.Body);

            var fieldNames = MyContexthelper
                .GetVariantsByTemplate(dbContext, template, fieldNameId, maxCount);

            return Ok(fieldNames);
        }


        private readonly MyContext dbContext;
    }
}