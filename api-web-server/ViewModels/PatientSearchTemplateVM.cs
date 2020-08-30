using database.Models;
using System.Collections.Generic;
using System.Linq;

namespace api_web_server.ViewModels
{
    public class PatientSearchTemplateVM
    {
        public PatientSearchTemplateVM() { }
        public PatientSearchTemplateVM(List<FieldName> fields)
        {
            Fields = fields
                .Select(f => new PatientSearchTemplateFieldVM(f))
                .ToList();
        }

        public List<PatientSearchTemplateFieldVM> Fields { get; set; }
    }
}