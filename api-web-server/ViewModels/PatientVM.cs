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

            DatabaseId = instance.Id;
            LocalId = instance.Id;
        }
        public static PatientVM CreateEmpty(List<FieldName> fieldNames)
        {
            PatientVM patient = new PatientVM()
            {
                Fields = fieldNames
                    .Select(fn => PatientFieldVM.CreateEmpty(fn))
                    .ToList(),
                LocalId = 0,
                DatabaseId = 0
            };
            return patient;
        }

        public bool UpdateModel(Patient model, List<FieldName> existingFieldNames)
        {
            bool updated = false;

            foreach (PatientFieldVM templateField in this.Fields)
            {
                PatientField modelField = model.Fields
                    .FirstOrDefault(f => f.Name.Value.Equals(templateField.Name));

                if (modelField == null)
                {
                    FieldName nameForField = existingFieldNames.First(
                        f => f.Value.Equals(templateField.Name)
                    );
                    modelField = new PatientField(nameForField);
                    model.Fields.Add(modelField);
                }

                if (!modelField.Value.Equals(templateField.Value)) {
                    modelField.Value = templateField.Value;
                    updated = true;
                }
            }

            return updated;
        }

        public List<PatientFieldVM> Fields { get; set; }

        public int DatabaseId { get; set; }
        public int LocalId { get; set; }
    }
}