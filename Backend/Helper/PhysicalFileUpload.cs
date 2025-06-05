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
    public async Task<string> UploadImage(string Location, IFormFile file)
    {
        var path = _webHostEnvironment.WebRootPath + "/" + Location + "/";    // create folder
        var extension = Path.GetExtension(file.FileName);
        var fileName = Guid.NewGuid().ToString().Replace("-", string.Empty) + extension;   // name of image
        if (file.Length > 0)
        {
            try
            {
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                using (FileStream fileStream = File.Create(path + fileName))
                {
                    await file.CopyToAsync(fileStream);
                    await fileStream.FlushAsync();
                    return $"/{Location}/{fileName}";
                }
            }
            catch (Exception)
            {
                return "FailedToUploadImage";
            }
        }
        else
        {
            return "NoImage";
        }
    }
    #endregion


    /// <summary>
    /// Uploads a file to the specified location within the web root.
    /// </summary>
    /// <param name="locationType">A string indicating the type of content (e.g., "images", "documents"). This will be used as a subfolder name.</param>
    /// <param name="file">The IFormFile to upload.</param>
    /// <returns>The relative URL path of the uploaded file on success, or an error string.</returns>
    public async Task<string> UploadFile(string locationType, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return "NoFileProvided"; // More generic error message
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

        if (!isAllowedExtension || !isAllowedMimeType)
        {
            // You might want to be more specific here, e.g., "InvalidImageFormat" or "InvalidDocumentFormat"
            // based on how you categorize locationType, or just "InvalidFileType"
            return "InvalidFileType";
        }

        // --- Determine Storage Path based on locationType (e.g., "images", "documents") ---
        // Ensure that locationType is clean and safe to use as a directory name
        // You might want to sanitize locationType further to prevent directory traversal attacks
        // For simplicity, assuming locationType comes from a controlled set (e.g., enum or predefined strings)
        var uploadRootPath = Path.Combine(_webHostEnvironment.WebRootPath, locationType);

        if (file.Length > 0)
        {
            try
            {
                if (!Directory.Exists(uploadRootPath))
                {
                    Directory.CreateDirectory(uploadRootPath);
                }

                var fullFilePath = Path.Combine(uploadRootPath, fileName);

                using (FileStream fileStream = File.Create(fullFilePath))
                {
                    await file.CopyToAsync(fileStream);
                    // await fileStream.FlushAsync(); // Often not strictly necessary after CopyToAsync
                    return $"/{locationType}/{fileName}"; // Return the relative URL path
                }
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Error uploading file {FileName} to {Path}", fileName, uploadRootPath);
                return "FailedToUploadFile"; // More generic error
            }
        }
        else
        {
            return "EmptyFile"; // Indicates file length was 0 despite not being null
        }
    }
}