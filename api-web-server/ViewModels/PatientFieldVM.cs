using database.Models;

namespace api_web_server.ViewModels {
    public class PatientFieldVM {
        public PatientFieldVM(PatientField instance)
        {
            Name = instance.Name.Value;
            Value = instance.Value;
        }

        public string Name {get;set;}
        public string Value {get;set;}
    }
}