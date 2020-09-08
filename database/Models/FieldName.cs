namespace database.Models
{
    public class FieldName : ModelBase
    {
        public FieldName() {}
        public FieldName(int id, string value) {
            Id = id;
            Value = value;
        }
        public string Value { get; set; }
    }
}