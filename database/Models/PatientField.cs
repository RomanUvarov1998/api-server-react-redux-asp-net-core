namespace database.Models
{
    public class PatientField
    {
        public int PatientId { get; set; }
        public int NameId { get; set; }
        public string Value { get; set; }

        public Patient Patient { get; set; }
        public FieldName Name { get; set; }
    }
}