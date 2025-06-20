namespace Backend.Helper;

public class ErrorHappen : ResponseHandler
{
    public static Response<string> ErrorInServer()
    {
        return ServerError<string>();
    }
}