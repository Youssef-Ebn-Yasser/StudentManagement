using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Account = CloudinaryDotNet.Account;

namespace Backend.Helper;

public class FileService : IFileService
{
    #region   Fields
    private readonly Cloudinary _cloudinary;
    IHttpClientFactory _httpClientFactory;
    #endregion


    #region   Constructor
    public FileService(IOptions<CloudinarySettings> config,
                             IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;

        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(account);
    }
    #endregion


    #region   Handle Methods
    public async Task<string?> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams() // Works for all file types
        {
            File = new FileDescription(file.FileName, stream),
            PublicId = Guid.NewGuid().ToString(), // Generate unique public ID
            Overwrite = false, // Prevent overwriting existing files
            Invalidate = true, // Refresh CDN cache
            Type = "upload", // Ensure public access
            Transformation = new Transformation().Crop("scale") // optional
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl?.ToString();
    }
    public async Task<(bool Success, string Message)> DeleteImageByUrlAsync(string imageUrl)
    {
        try
        {
            // Step 1: Validate and extract public ID
            if (string.IsNullOrEmpty(imageUrl))
                return (false, "URL cannot be empty");

            var publicId = ExtractPublicIdFromUrl(imageUrl);
            if (string.IsNullOrEmpty(publicId))
                return (false, "Invalid Cloudinary URL format");

            // Step 2: Execute deletion
            var deletionParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image,
                Invalidate = true // Optional CDN cache purge
            };

            var result = await _cloudinary.DestroyAsync(deletionParams);

            // Step 3: Handle response
            if (result.Result == "ok")
                return (true, $"Deleted {publicId} successfully");

            return (false, $"Cloudinary error: {result.Result} (Status: {result.StatusCode})");
        }
        catch (Exception ex)
        {

            return (false, $"Server error: {ex.Message}");
        }
    }
    private string ExtractPublicIdFromUrl(string url)
    {
        try
        {
            var uri = new Uri(url);
            var segments = uri.AbsolutePath.Split('/');

            // Find the "upload" segment (could be after version)
            var uploadIndex = Array.FindIndex(segments, s => s == "upload");
            if (uploadIndex < 0) return null;

            // Get everything after upload segment
            var publicIdWithExtension = string.Join("/", segments.Skip(uploadIndex + 2));

            // Remove file extension
            return Path.GetFileNameWithoutExtension(publicIdWithExtension);
        }
        catch
        {
            return null;
        }
    }
    #endregion
}