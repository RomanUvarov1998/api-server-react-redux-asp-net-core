using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using api_web_server.Controllers.ActionFilters;
using System;

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

            T model = JsonConvert.DeserializeObject<T>(json, serializerSettings);

            if (model == null)
            {
                throw new MyException(MyExceptionType.DeserializedToNull, json);
            }

            return model;
        }

        // public static TEntity1 FirstNonExistingOrDefault<TEntity1, TEntity2>(
        //     List<TEntity1> list1,
        //     List<TEntity2> list2,
        //     Func<TEntity1, TEntity2, bool> areEqual)
        // {
        //     TEntity1 nonExistingField = list1
        //                     .FirstOrDefault(el1 => !list2
        //                         .Any(el2 => areEqual(el1, el2)));

        //     return nonExistingField;
        // }
    }

}