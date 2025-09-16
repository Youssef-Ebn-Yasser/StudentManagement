namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GeminiController : ControllerBase
{
    #region Fields
    private readonly GeminiService _gemini;
    private readonly IStructuredLogger _logger;
    #endregion

    #region Constructor
    public GeminiController(GeminiService gemini, IStructuredLogger logger)
    {
        _gemini = gemini;
        _logger = logger;
    }
    #endregion

    #region Method
    [HttpPost("chatboot")]
    public async Task<IActionResult> Chat([FromBody] PromptRequest request)
    {
        var response = await _gemini.GetResponseAsync(request.Prompt);
        return Ok(new { response });
    }

    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
    #endregion
}