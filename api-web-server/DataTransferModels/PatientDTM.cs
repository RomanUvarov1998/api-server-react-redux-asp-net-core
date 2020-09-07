using System.Security.AccessControl;
using database.Models;
using System.Collections.Generic;
using System.Linq;

namespace api_web_server.DataTransferModels
{
    public class PatientDTM
    {
        public PatientDTM() { }
        public PatientDTM(Patient instance)
        {
            Fields = instance.Fields
                .Select(f => new PatientFieldDTM(f))
                .ToList();

            Id = instance.Id;
        }
        public static PatientDTM CreateEmpty(List<FieldName> fieldNames)
        {
            PatientDTM patient = new PatientDTM()
            {
                Fields = fieldNames
                    .Select(fn => PatientFieldDTM.CreateEmpty(fn))
                    .ToList(),
                Id = 0
            };
            return patient;
        }

        public bool UpdateModel(Patient model, List<FieldName> existingFieldNames)
        {
            bool updated = false;

            foreach (PatientFieldDTM templateField in this.Fields)
            {
                PatientField modelField = model.Fields
                    .FirstOrDefault(f => f.Name.Id == templateField.NameId);

                if (modelField == null)
                {
                    FieldName nameForField = existingFieldNames.First(
                        f => f.Id == templateField.NameId
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

        public List<PatientFieldDTM> Fields { get; set; }

        public int Id { get; set; }
    }
}