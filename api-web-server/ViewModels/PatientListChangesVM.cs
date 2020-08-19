using System.Collections.Generic;

namespace api_web_server.ViewModels
{
    public class PatientListChangesVM
    {
        public List<PatientVM> PatientsToSave { get; set; }
        public List<int> IdsToDelete { get; set; }
    }
}