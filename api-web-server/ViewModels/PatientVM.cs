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
            Status = Status.Untouched;
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

                if (!modelField.Value.Equals(templateField.Value))
                {
                    modelField.Value = templateField.Value;
                    updated = true;
                }
            }

            return updated;
        }

        public void UpdateDatabaseId(Patient model)
        {
            this.Id = model.Id;
        }

        public List<PatientFieldVM> Fields { get; set; }

        public int Id { get; set; }
        public Status Status { get; set; }
    }
    public enum Status
    {
        Added,
        Modified,
        Deleted,
        Untouched
    }
}