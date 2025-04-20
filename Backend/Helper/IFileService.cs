namespace Backend.Helper;

public interface IFileService
{
    public Task<string?> UploadFileAsync(IFormFile file);
    public Task<(bool Success, string Message)> DeleteImageByUrlAsync(string? imageUrl);
}