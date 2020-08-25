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

        public static IQueryable<Patient> IncludeFields(DbSet<Patient> query) =>
            query
                .Include(p => p.Fields)
                    .ThenInclude(f => f.Name);
    }
}