namespace Backend.Controllers;

[Route("api/[controller]")]

[ApiController]
public class FileController : ControllerBase
{
    #region Fields
    private readonly IFileService _cloudinaryService;
    private readonly PhysicalFileUpload physicalFileUpload;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public FileController(IFileService cloudinaryService, PhysicalFileUpload physicalFileUpload, IStructuredLogger logger)
    {
        _cloudinaryService = cloudinaryService;
        this.physicalFileUpload = physicalFileUpload;
        _logger = logger;
    }
    #endregion

    #region Method
    [HttpPost("upload/file")]
    public async Task<IActionResult> UploadFile([FromBody] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var url = await _cloudinaryService.UploadFileAsync(file);
        if (url == null)
            return StatusCode(500, "Failed to upload file");

        return Ok(new { Url = url });
    }

    [HttpPost("upload/physical/file")]
    public async Task<IActionResult> UploadPhysicalFile(IFormFile file)
    {

        var url = await physicalFileUpload.UploadFileAsync("teacher", file);
        if (url == null)
            return StatusCode(500, "Failed to upload file");


        return Ok(new { url = url });
    }


    //[HttpPost("view")]
    //public IActionResult ViewFile([FromBody] string relativePath)
    //{
    //    var filePath = physicalFileUpload.GetPhysicalPath(relativePath);

    //    if (!System.IO.File.Exists(filePath))
    //        return NotFound();

    //    var ext = Path.GetExtension(filePath).ToLowerInvariant();
    //    var contentType = ext switch
    //    {
    //        ".pdf" => "application/pdf",
    //        ".jpg" or ".jpeg" => "image/jpeg",
    //        ".png" => "image/png",
    //        ".gif" => "image/gif",
    //        ".webp" => "image/webp",
    //        _ => "application/octet-stream"
    //    };

    //    var fileStream = System.IO.File.OpenRead(filePath);

    //    Response.Headers["Content-Disposition"] = $"inline; filename=\"{Path.GetFileName(filePath)}\"";


    //    return File(fileStream, contentType);
    //}

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteImage([FromQuery] string url)
    {
        var (success, message) = await _cloudinaryService.DeleteImageByUrlAsync(url);

        if (success)
            return Ok(new { Message = message });

        return BadRequest(new
        {
            Error = message,
            Tip = "Make sure: 1) URL is correct 2) File exists 3) API key has delete permissions"
        });
    }
    #endregion
}