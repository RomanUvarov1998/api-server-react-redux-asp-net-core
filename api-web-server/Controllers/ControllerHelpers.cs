using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

namespace api_web_server.Controllers
{
    public static class ControllerHelpers
    {
        public static async Task<T> ReadModelFromBodyAsync<T>(Stream requestBody)
        {
            StreamReader stream = new StreamReader(requestBody);
            string json = await stream.ReadToEndAsync();

            var serializerSettings = new JsonSerializerSettings()
            {
                MissingMemberHandling = MissingMemberHandling.Error
            };

            T model = JsonConvert
                .DeserializeObject<T>(json, serializerSettings);

            return model;
        }
    }

}