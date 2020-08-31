using database.Models;

namespace api_web_server.DataTransferModels
{
    public class PatientFieldDTM
    {
        public PatientFieldDTM() { }
        public PatientFieldDTM(PatientField instance)
        {
            Name = instance.Name.Value;
            NameId = instance.Name.Id;
            Value = instance.Value;
        }
        public static PatientFieldDTM CreateEmpty(FieldName fieldName) =>
            new PatientFieldDTM() { 
                Name = fieldName.Value, 
                NameId = fieldName.Id, 
                Value = string.Empty };

        public int NameId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}