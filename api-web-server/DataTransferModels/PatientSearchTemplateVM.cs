using database.Models;
using System.Collections.Generic;
using System.Linq;

namespace api_web_server.DataTransferModels
{
    public class PatientSearchTemplateDTM
    {
        public PatientSearchTemplateDTM() { }
        public PatientSearchTemplateDTM(List<FieldName> fields)
        {
            Fields = fields
                .Select(f => new PatientSearchTemplateFieldDTM(f))
                .ToList();
        }

        public List<PatientSearchTemplateFieldDTM> Fields { get; set; }
    }
}