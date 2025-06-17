namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TranslationController : ControllerBase
{
    private readonly GeminiObjectTranslator _translateService;

    public TranslationController(GeminiObjectTranslator translateService)
    {
        _translateService = translateService;
    }

    [HttpPost("translate-object")]
    public async Task<IActionResult> TranslateObject([FromBody] YourDto dto, string from = "English", string to = "Arabic")
    {
        var translated = await _translateService.TranslateObjectAsync(dto, from, to);

        if (translated == null)
            return BadRequest("Translation failed or object could not be deserialized.");

        return Ok(translated); // ✅ return content, not NoContent()
    }
}

public class YourDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Notes { get; set; }
    public decimal Price { get; set; } // will be ignored
}