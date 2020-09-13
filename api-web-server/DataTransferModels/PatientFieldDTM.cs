using database.Models;

namespace api_web_server.DataTransferModels
{
    public class PatientFieldDTM : ICanUpdateModel<PatientField>
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

        #region  ICanUpdateModel<Patient>
        public bool UpdateModel(PatientField model)
        {
            bool updated = false;

            if (this.NameId != model.NameId)
            {
                updated = true;
                model.NameId = this.NameId;
            }

            if (!string.Equals(this.Value, model.Value))
            {
                updated = true;
                model.Value = this.Value;
            }

            return updated;
        }
        # endregion

        public override string ToString()
        {
            return $"{nameof(PatientFieldDTM)}: {{ NameId: {this.NameId}, Name: {this.Name}, Value: {this.Value}}}";
        }
    }
}