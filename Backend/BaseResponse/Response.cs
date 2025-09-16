namespace Backend.BaseResponse;

public class Response<T>
{
    public Response()
    {
    }
    public Response(T data, string? massage = null)
    {
        Succeeded = true;
        Massage = massage;
        Data = data;
    }
    public Response(string? massage = null)
    {
        Succeeded = true;
        Massage = massage;
    }
    public Response(string? massage, bool succussed)
    {
        Succeeded = true;
        Massage = massage;
    }

    public HttpStatusCode httpStatusCode { get; set; }
    public object? Meta { get; set; }
    public bool Succeeded { get; set; }
    public string? Massage { get; set; }
    public List<string>? Errors { get; set; } = new List<string>();
    public T? Data { get; set; }
}