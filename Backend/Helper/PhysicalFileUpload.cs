namespace Backend.Helper;

public class PhysicalFileUpload
{
    #region    Fields
    private readonly IWebHostEnvironment _webHostEnvironment;
    #endregion

    #region    Constructor
    public PhysicalFileUpload(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }
    #endregion

    #region   Handle methods
    public async Task<string> UploadFile(string location, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return "NoFileProvided";
        }

        var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant(); // Ensure lowercase for comparison
        var fileName = Guid.NewGuid().ToString().Replace("-", string.Empty) + extension;

        // --- File Type Validation ---
        var allowedImageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var allowedDocumentExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" }; // Add more as needed
        var allowedMimeTypes = new[]
        {
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/vnd.ms-excel", // .xls
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-powerpoint", // .ppt
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx
        };

        bool isAllowedExtension = allowedImageExtensions.Contains(extension) || allowedDocumentExtensions.Contains(extension);
        bool isAllowedMimeType = allowedMimeTypes.Contains(file.ContentType);

        if (!isAllowedExtension || !isAllowedMimeType) return "InvalidFileType";

        var uploadRootPath = Path.Combine(_webHostEnvironment.WebRootPath, location);

        if (file.Length > 0)
        {
            try
            {
                if (!Directory.Exists(uploadRootPath))
                    Directory.CreateDirectory(uploadRootPath);

                var fullFilePath = Path.Combine(uploadRootPath, fileName);

                using (FileStream fileStream = File.Create(fullFilePath))
                {
                    await file.CopyToAsync(fileStream);
                    await fileStream.FlushAsync();

                    //return $"/{location}/{fileName}";
                    return fullFilePath;
                }
            }
            catch (Exception ex)
            {
                return "FailedToUploadFile";
            }
        }
        else
        {
            return "EmptyFile";
        }
    }

    #endregion

}