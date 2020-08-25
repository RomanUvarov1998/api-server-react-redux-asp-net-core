namespace database.Models
{
    public class PatientField
    {
        public PatientField() { }
        public PatientField(FieldName name)
        {
            Name = name;
            Value = string.Empty;
        }
        public PatientField(FieldName name, string value): this(name) 
        {
            Value = value;
        }
        public int PatientId { get; set; }
        public int NameId { get; set; }
        public string Value { get; set; }

        public Patient Patient { get; set; }
        public FieldName Name { get; set; }
    }
}