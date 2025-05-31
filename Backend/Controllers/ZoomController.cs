using Backend.DTOs.MeetingDTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/zoom")] // Base route (must be lowercase) to match my redirect Url
public class ZoomController : AppControllerBase
{
    private readonly IMeetingService _meetService;

    public ZoomController(IMeetingService meetService)
    {
        _meetService = meetService;
    }

    [HttpGet("authorize")]
    public IActionResult Authorize()
    {

        try
        {
            var result = _meetService.Authorize();
            return Redirect(result);
        }
        catch
        {
            return BadRequest("error happen");
        }
    }

    [HttpGet("callback")] // must match redirect bUrl in zoom marktplace api/zoom/callback
    public async Task<IActionResult> Callback([FromQuery] string code)
    {
        try
        {
            var result = await _meetService.Callback(code);
            return Redirect(result);
        }
        catch
        {
            return BadRequest("error happen");
        }
    }


    [HttpPost("create-meeting")]
    public async Task<IActionResult> CreateMeeting([FromBody] MeetingRequestDto request)
    {
        try
        {
            var result = await _meetService.CreateMeeting(request);

            return NewResult(result);
        }
        catch
        {
            return BadRequest("error happen");
        }
    }

    [HttpGet("check-auth")]
    public IActionResult CheckAuth()
    {
        var result = _meetService.CheckAuth();
        return Ok(new
        {
            is_authenticated = result.Item1,
            token_status = result.Item2,
        });
    }


    [HttpGet("meetings")]
    public async Task<IActionResult> GetMeetings(int courseId)
    {

        try
        {
            var result = await _meetService.GetMeetingsForCourse(courseId);

            return NewResult(result);
        }
        catch
        {
            return BadRequest("error happen");
        }
    }
}