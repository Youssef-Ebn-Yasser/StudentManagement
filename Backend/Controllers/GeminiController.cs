namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GeminiController : ControllerBase
{
    private readonly GeminiService _gemini;

    public GeminiController(GeminiService gemini)
    {
        _gemini = gemini;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] PromptRequest request)
    {
        var response = await _gemini.GetResponseAsync(request.Prompt);
        return Ok(new { response });
    }

    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}