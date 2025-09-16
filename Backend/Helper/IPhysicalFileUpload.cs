namespace Backend.Helper;

public interface IPhysicalFileUpload
{
    public Task<string> UploadFileAsync(string location, IFormFile file);
}