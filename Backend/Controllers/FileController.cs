namespace Backend.Controllers;

[Route("api/[controller]")]

[ApiController]
public class FileController : ControllerBase
{
    private readonly IFileService _cloudinaryService;

    public FileController(IFileService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    //Endpoint 1: Upload file
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
}