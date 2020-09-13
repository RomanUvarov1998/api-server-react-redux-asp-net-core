namespace api_web_server.Controllers
{
    public class Constants
    {
        public const string ROUTE_CONTROLLER_PATIENTS = "patients";
        public const string ROUTE_ACTION_PATIENTS_ADD = "add";
        public const string ROUTE_ACTION_PATIENTS_UPDATE = "update";
        public const string ROUTE_ACTION_PATIENTS_DELETE = "delete";
        public const string ROUTE_ACTION_PATIENTS_RESTORE = "restore";
        public const string ROUTE_ACTION_PATIENTS_GET_LIST = "list";

        public const string ROUTE_CONTROLLER_FIELD_NAMES = "field_names";
        public const string ROUTE_ACTION_GET_TEMPLATE = "template";
        public const string ROUTE_ACTION_SET_TEMPLATE = "template";
        public const string ROUTE_ACTION_GET_VARIANTS = "variants";
    
        public const string ROUTE_ERROR_HANDLER = "my_error_handler";
    }
}