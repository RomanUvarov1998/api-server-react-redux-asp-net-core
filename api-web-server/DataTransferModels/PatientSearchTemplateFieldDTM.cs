using database.Models;
using System.Collections.Generic;
using System.Text;
using System;

namespace api_web_server.DataTransferModels
{
    public class PatientSearchTemplateFieldDTM : IDeleteRestorableEntity, ICanUpdateModel<FieldName>
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

        #region ICanUpdateModel<FieldName> 
        public bool UpdateModel(FieldName fieldName)
        {
            bool updated = false;

            if (!string.Equals(fieldName.Value, this.Name))
            {
                fieldName.Value = this.Name;
                updated = true;
            }

            if (!string.Equals(fieldName.IsDeleted, this.IsDeleted))
            {
                fieldName.IsDeleted = this.IsDeleted;
                updated = true;
            }

            return updated;
        }
        #endregion

        #region IDeleteRestorableEntity 
        public bool IsDeleted { get; set; } = false;
        #endregion

        public override string ToString()
        {
            var sb = new StringBuilder($"{nameof(PatientSearchTemplateFieldDTM)} {{ ");
            sb.Append($"Name: {Name}, ");
            sb.Append($"NameId: {NameId}, ");
            sb.Append($"Value: {Value}, ");
            sb.Append($"Variants: {String.Join(",", Variants)} }}");
            return sb.ToString();
        }
    }
}