using System;
using System.Runtime.Serialization;

namespace api_web_server.Controllers.ActionFilters
{
    public enum MyExceptionType
    {
        DoesNotExistInDatabase,
        DeserializedToNull,
        NegativeTakeArgument,
        NegativeSkipArgument,
    }
    
    // Was written using docunentation:
    // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/exceptions/creating-and-throwing-exceptions
    public class MyException : Exception
    {
        public MyException() : base() { }
        public MyException(string message) : base(message) { }
        public MyException(string message, Exception inner) : base(message, inner) { }

        public MyException(MyExceptionType type, object entity)
         : base(GetMessageForExType(type, entity))
        {
            this.ExType = type;
        }
        private static string GetMessageForExType(MyExceptionType type, object entity)
        {
            return type switch
            {
                MyExceptionType.DoesNotExistInDatabase => $"Entity {entity} doesn't exist in the database",
                MyExceptionType.DeserializedToNull => $"Recieved {entity} couldn't be deserialized correctly",
                MyExceptionType.NegativeTakeArgument => $"Take must be >= 0, but it is {entity}",
                MyExceptionType.NegativeSkipArgument => $"Skip must be >= 0, but it is {entity}",
                _ => throw new NotImplementedException("Not all MyExceptionType variants are implemented"),
            };
        }
        // A constructor is needed for serialization when an
        // exception propagates from a remoting server to the client.
        protected MyException(SerializationInfo info, StreamingContext context) : base(info, context) { }

        public override string ToString()
        {
            return $"My Exception with type: {this.ExType}\n, {base.ToString()}";
        }

        public MyExceptionType ExType { get; set; }
        public object Entity { get; set; }
    }
}