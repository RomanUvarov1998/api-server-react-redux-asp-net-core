using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace database.Models
{
    public class Patient : ModelBase
    {
        public Patient()
        {
            Fields = new HashSet<PatientField>();
        }
        public Patient(params PatientField[] fields) : this() {
            Fields = fields.ToList();
        }

        public ICollection<PatientField> Fields { get; set; }
    }
}