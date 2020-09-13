
namespace database.Models
{
    public interface IDeleteRestorableEntity
    {
        bool IsDeleted { get; set; }
    }
}