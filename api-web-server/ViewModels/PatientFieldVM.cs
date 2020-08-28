using database.Models;

namespace api_web_server.ViewModels
{
    public class PatientFieldVM
    {
        public PatientFieldVM() { }
        public PatientFieldVM(PatientField instance)
        {
            Name = instance.Name.Value;
            NameId = instance.Name.Id;
            Value = instance.Value;
        }
        public static PatientFieldVM CreateEmpty(FieldName fieldName) =>
            new PatientFieldVM() { 
                Name = fieldName.Value, 
                NameId = fieldName.Id, 
                Value = string.Empty };

        public int NameId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}