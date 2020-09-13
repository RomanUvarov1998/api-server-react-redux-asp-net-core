using System.Collections.Generic;
using System.Linq;
using database.Models;
using api_web_server.Controllers.ActionFilters;

namespace api_web_server.DataTransferModels
{
    public class PatientDTM : ICanUpdateModel<Patient>, IDeleteRestorableEntity
    {
        public PatientDTM() { }
        public PatientDTM(Patient instance)
        {
            Fields = instance.Fields
                .Select(f => new PatientFieldDTM(f))
                .ToList();

            Id = instance.Id;
        }
   
        public List<PatientFieldDTM> Fields { get; set; }

        public int Id { get; set; }

        #region IDeleteRestorableEntity 
        public bool IsDeleted { get; set; } = false;
        # endregion

        #region  ICanUpdateModel<Patient>
        public bool UpdateModel(Patient model)
        {
            bool updated = false;

            foreach (PatientFieldDTM dtmField in this.Fields)
            {
                PatientField modelField = model.Fields
                    .FirstOrDefault(f => f.Name.Id == dtmField.NameId)
                    ?? throw new MyException(
                        MyExceptionType.DoesNotExistInDatabase, 
                        dtmField);

                if (dtmField.UpdateModel(modelField))
                {
                    updated = true;
                }
            }

            if (this.Id != model.Id)
            {
                updated = true;
                model.Id = this.Id;
            }

            if (this.IsDeleted != model.IsDeleted)
            {
                updated = true;
                model.IsDeleted = this.IsDeleted;
            }

            return updated;
        }
        # endregion

        public override string ToString()
        {
            return $"{nameof(PatientDTM)} {{ Id: {this.Id}, Fields: {this.Fields}, IsDeleted: {this.IsDeleted} }}";
        }
    }
}