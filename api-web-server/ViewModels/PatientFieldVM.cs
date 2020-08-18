using database.Models;

namespace api_web_server.ViewModels
{
    public class PatientFieldVM
    {
        public PatientFieldVM() { }
        public PatientFieldVM(PatientField instance)
        {
            Name = instance.Name.Value;
            Value = instance.Value;
        }
        public static PatientFieldVM CreateEmpty(FieldName fieldName) =>
            new PatientFieldVM() { Name = fieldName.Value, Value = string.Empty };

        public string Name { get; set; }
        public string Value { get; set; }
    }
}