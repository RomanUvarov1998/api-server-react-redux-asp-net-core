namespace database
{
    public class PatientField
    {
        public int PatientId { get; set; }
        public int NameId { get; set; }
        public int ValueId { get; set; }

        public FieldName Name { get; set; }
        public FieldValue Value { get; set; }
    }
}