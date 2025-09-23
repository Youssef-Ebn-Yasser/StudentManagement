namespace YourApp.Controllers;

[Route("api/video")]
[ApiController]
public class HlsVideoController : AppControllerBase
{
    #region   Fields
    private readonly string _hlsRoot;
    private readonly IWebHostEnvironment _env;
    private readonly IVedioUpload _vedioUpload;
    private readonly ApplicationDbContext _context;
    #endregion


    #region   Constructor
    public HlsVideoController(IWebHostEnvironment env, IVedioUpload vedioUpload, ApplicationDbContext context)
    {
        _env = env;
        _hlsRoot = Path.Combine(env.ContentRootPath, "wwwroot");
        if (!Directory.Exists(_hlsRoot))
            Directory.CreateDirectory(_hlsRoot);
        _vedioUpload = vedioUpload;
        _context = context;
    }
    #endregion

    #region  Methods
    [HttpGet("All")]
    public async Task<IActionResult> GetAllVedios()
    {
        try
        {
            var result = await _vedioUpload.GetAllVedios();

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetVedioById(int id)
    {
        try
        {
            var result = await _vedioUpload.GetVedioDetails(id);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVedio(int id, EnVedioPermision Permision)
    {
        try
        {
            var result = await _vedioUpload.UpdateVedioPermision(id, Permision);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVedio(int id)
    {
        try
        {
            var result = await _vedioUpload.DeleteVedio(id);

            return NewResult(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("upload")]
    [RequestSizeLimit(1_000_000_000)] // 1 GB max
    public async Task<IActionResult> Upload(IFormFile file, EnVedioPermision vedioPermision, EnVedioFor VedioFor, int? relatedBy,
                                            EnVedioUploadedBy vedioUploadedBy, int uploadedById, EnSavedInType savedInType)
    {
        try
        {
            var result = await _vedioUpload.uploadVedio(file, vedioPermision, VedioFor, relatedBy, vedioUploadedBy, uploadedById, savedInType);
            return Ok(result.Item2);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetVedio")]
    public async Task<IActionResult> GetVedio([FromQuery] EnVedioFor VedioFor, [FromQuery] int? relatedBy)
    {
        try
        {
            var result = await _vedioUpload.getLinks(VedioFor, relatedBy);

            if (result.Item2 == null)
            {
                BadRequest("Errro Happen");
            }

            return Ok(result.Item2);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpGet("hls/{folder}/{*file}")]
    public IActionResult GetChunk(string folder, string file)
    {
        var filePath = Path.Combine(_hlsRoot, folder, file);

        if (!System.IO.File.Exists(filePath))
            return NotFound();

        string contentType = "application/octet-stream";
        if (file.EndsWith(".m3u8")) contentType = "application/vnd.apple.mpegurl";
        else if (file.EndsWith(".ts")) contentType = "video/mp2t";

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return File(stream, contentType);
    }


    [HttpGet("dependencies")]
    public async Task<IActionResult> GeyDependencies(EnVedioFor vedioFor)
    {
        try
        {
            var response = await _vedioUpload.createVedioDependencies(vedioFor);

            return Ok(response);

        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException);

        }
    }
    #endregion
}