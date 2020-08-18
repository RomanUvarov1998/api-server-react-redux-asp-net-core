using System.Security.AccessControl;
using database.Models;
using System.Collections.Generic;
using System.Linq;

namespace api_web_server.ViewModels
{
    public class PatientVM
    {
        public PatientVM(Patient instance)
        {
            Fields = instance.Fields
                .Select(f => new PatientFieldVM(f))
                .ToList();

                Id = instance.Id;
        }

        public List<PatientFieldVM> Fields { get; set; }

        public int Id { get; set; }

        public static List<PatientVM> GetList(List<Patient> instances) =>
            instances.Select(p => new PatientVM(p)).ToList();
    }
}