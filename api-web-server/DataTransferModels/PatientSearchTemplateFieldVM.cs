using database.Models;
using System.Collections.Generic;

namespace api_web_server.DataTransferModels
{
    public class PatientSearchTemplateFieldDTM
    {
        public PatientSearchTemplateFieldDTM() { }
        public PatientSearchTemplateFieldDTM(FieldName fieldName)
        {
            Name = fieldName.Value;
            NameId = fieldName.Id;
            Value = string.Empty;
            Variants = new List<string>();
        }

        public string Name { get; set; }
        public int NameId { get; set; }
        public string Value { get; set; }
        public List<string> Variants { get; set; }
    }
}