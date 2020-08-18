using System.Security.AccessControl;
using database.Models;
using System.Collections.Generic;
using System.Linq;

namespace api_web_server.ViewModels
{
    public class PatientVM
    {
        public PatientVM() { }
        public PatientVM(Patient instance)
        {
            Fields = instance.Fields
                .Select(f => new PatientFieldVM(f))
                .ToList();

            Id = instance.Id;
        }
        public static PatientVM CreateEmpty(List<FieldName> fieldNames)
        {
            PatientVM patient = new PatientVM()
            {
                Fields = fieldNames
                    .Select(fn => PatientFieldVM.CreateEmpty(fn))
                    .ToList(),
                Id = 0
            };
            return patient;
        }

        public List<PatientFieldVM> Fields { get; set; }

        public int Id { get; set; }
    }
}