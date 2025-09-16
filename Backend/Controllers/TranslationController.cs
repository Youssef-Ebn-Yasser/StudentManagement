using Hangfire;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TranslationController : ControllerBase
{
    private readonly IGeminiObjectTranslator _translateService;
    private readonly ApplicationDbContext _context;

    public TranslationController(IGeminiObjectTranslator translateService, ApplicationDbContext context)
    {
        _translateService = translateService;
        _context = context;
    }

    [HttpPost("translate-object")]
    public async Task<IActionResult> TranslateObject([FromBody] YourDto dto, string from = "English", string to = "Arabic")
    {
        var translated = await _translateService.TranslateObjectAsync(dto, from, to);

        if (translated == null)
            return BadRequest("Translation failed or object could not be deserialized.");

        return Ok(translated); // ✅ return content, not NoContent()
    }

    [HttpPost("background/Test")]
    public async Task<IActionResult> test(forTest forTest)
    {
        BackgroundJob.Enqueue(() => _translateService.test(forTest));

        return Ok("done");
    }


}
public class forTest
{
    public string nameEn { get; set; }
    public string nameAr { get; set; }

}
public class YourDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Notes { get; set; }
    public decimal Price { get; set; } // will be ignored
}