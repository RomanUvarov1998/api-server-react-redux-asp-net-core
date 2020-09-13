

namespace api_web_server.DataTransferModels
{
    public interface ICanUpdateModel<TEntity>
    {
        bool UpdateModel(TEntity model);
    }
}