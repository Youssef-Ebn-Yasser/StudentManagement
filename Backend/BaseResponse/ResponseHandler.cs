namespace Backend.BaseResponse;

public class ResponseHandler
{
    public Response<T> Delete<T>()
    {
        return new Response<T>()
        {
            httpStatusCode = System.Net.HttpStatusCode.OK,
            Succeeded = true,
            Massage = "Deleted"
        };
    }

    public Response<T> Success<T>(T entity, object? meta = null)
    {
        return new Response<T>()
        {
            Data = entity,
            httpStatusCode = System.Net.HttpStatusCode.OK,
            Succeeded = true,
            Massage = "Success",
            Meta = meta
        };
    }

    public Response<T> UnAuthorized<T>(string? message)
    {
        return new Response<T>()
        {
            httpStatusCode = System.Net.HttpStatusCode.Unauthorized,
            Succeeded = false,
            Massage = message,
        };
    }

    public Response<T> BadRequest<T>(string? message)
    {
        return new Response<T>()
        {
            httpStatusCode = System.Net.HttpStatusCode.BadRequest,
            Succeeded = false,
            Massage = message == null ? "BadRequest" : message
        };
    }
    public Response<T> NotFound<T>(string? message)
    {
        return new Response<T>()
        {
            httpStatusCode = System.Net.HttpStatusCode.NotFound,
            Succeeded = false,
            Massage = message == null ? "NotFound" : message
        };
    }
    public Response<T> Created<T>(string? message)
    {
        return new Response<T>()
        {
            httpStatusCode = System.Net.HttpStatusCode.Created,
            Succeeded = true,
            Massage = message == null ? "Created" : message
        };
    }

    public static Response<T> ServerError<T>()
    {
        return new Response<T>()
        {
            httpStatusCode = System.Net.HttpStatusCode.InternalServerError,
            Succeeded = false,
            Massage = "Server Error Try Latter"
        };
    }
}