using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using System;

namespace api_web_server.Controllers.ActionFilters
{
    public class ResponseErrorFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context) { }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (!(context.Exception is MyException myException))
            {
                context.ExceptionHandled = false;
                return;
            }

            ObjectResult result = new ObjectResult(myException.Message);

            switch (myException.ExType)
            {
                case MyExceptionType.DoesNotExistInDatabase:
                    result.StatusCode = StatusCodes.Status404NotFound;
                    break;
                case MyExceptionType.NegativeTakeArgument:
                case MyExceptionType.NegativeSkipArgument:
                    result.StatusCode = StatusCodes.Status400BadRequest;
                    break;
                default:
                    context.ExceptionHandled = false;
                    throw new NotImplementedException("Not all ex types are implemented");
            }

            context.Result = result;
            context.ExceptionHandled = true;
        }
    }
}