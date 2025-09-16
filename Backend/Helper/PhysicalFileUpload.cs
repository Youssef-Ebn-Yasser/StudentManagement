public class PhysicalFileUpload : IPhysicalFileUpload
{
    #region   Fields
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly IHttpContextAccessor _httpContextAccessor;
    #endregion

    #region   Constructor
    public PhysicalFileUpload(IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor)
    {
        _webHostEnvironment = webHostEnvironment;
        _httpContextAccessor = httpContextAccessor;
    }
    #endregion

    #region   Methods
    public async Task<string> UploadFileAsync(string location, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return "NoFileProvided";

        var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
        var fileName = Guid.NewGuid().ToString("N") + extension;

        var allowedImageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var allowedDocumentExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" };
        var allowedMimeTypes = new[]
        {
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        };

        if (!allowedImageExtensions.Contains(extension) && !allowedDocumentExtensions.Contains(extension))
            return "InvalidFileType";

        if (!allowedMimeTypes.Contains(file.ContentType))
            return "InvalidFileType";

        var uploadRootPath = Path.Combine(_webHostEnvironment.WebRootPath, location);

        try
        {
            if (!Directory.Exists(uploadRootPath))
                Directory.CreateDirectory(uploadRootPath);

            var fullFilePath = Path.Combine(uploadRootPath, fileName);

            using (var stream = new FileStream(fullFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/{location}/{fileName}";

            var request = _httpContextAccessor.HttpContext?.Request;
            var absoluteUrl = $"{request?.Scheme}://{request?.Host}{relativeUrl}";

            return absoluteUrl;
        }
        catch
        {
            return "FailedToUploadFile";
        }
    }

    //public async Task<string> UploadFileAsync(string location, IFormFile file)
    //{
    //    if (file == null || file.Length == 0)
    //        return null;

    //    var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
    //    var fileName = Guid.NewGuid().ToString("N") + extension;

    //    var rootPath = Path.Combine(_webHostEnvironment.ContentRootPath, "SecureUploads", location);

    //    if (!Directory.Exists(rootPath))
    //        Directory.CreateDirectory(rootPath);

    //    var filePath = Path.Combine(rootPath, fileName);

    //    using var stream = new FileStream(filePath, FileMode.Create);
    //    await file.CopyToAsync(stream);

    //    return $"{location}//{fileName}"; // Store this in DB
    //}

    //public string GetPhysicalPath(string relativePath)
    //{
    //    return Path.Combine(_webHostEnvironment.ContentRootPath, "SecureUploads", relativePath);
    //}
    #endregion
}