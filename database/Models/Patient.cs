using System.Collections.Generic;

namespace database.Models
{
    public class Patient : ModelBase
    {
        public Patient() 
        {
            Fields = new HashSet<PatientField>();
        }

        public ICollection<PatientField> Fields { get; set; }
    }
}