namespace database.Models
{
    public class FieldName : ModelBase, IDeleteRestorableEntity
    {
        public FieldName() { }
        public FieldName(string value)
        {
            Value = value;
        }
        public string Value { get; set; }

        #region IDeleteRestorableEntity
        public bool IsDeleted { get; set; } = false;
        #endregion

        public override string ToString()
        {
            return $"FieldName {{ Id: {Id}, Value: {Value}, IsDeleted: {IsDeleted} }}";
        }
    }
}