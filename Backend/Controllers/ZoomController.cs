using Backend.DTOs.MeetingDTOs;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Web;

namespace Backend.Controllers;

[ApiController]
[Route("api/zoom")] // Base route (must be lowercase) to match my redirect Url
public class ZoomController : AppControllerBase
{
    private readonly IMeetingService _meetService;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public ZoomController(IMeetingService meetService, IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _meetService = meetService;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
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



    [HttpGet("attendance/{meetingUUID}")]
    public async Task<IActionResult> GetAttendance(string meetingUUID)
    {
        try
        {
            var participants = await GetMeetingParticipantsAsync(meetingUUID);
            return Ok(participants);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, $"Zoom API Error: {ex.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal Error: {ex.Message}");
        }
    }
    private async Task<string> GetAccessTokenAsync()
    {
        var clientId = _configuration["Zoom:ClientId"];
        var clientSecret = _configuration["Zoom:ClientSecret"];
        var accountId = "5095749697";

        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://zoom.us/oauth/token");
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}")));
        request.Content = new StringContent($"grant_type=account_credentials&account_id={accountId}", Encoding.UTF8, "application/x-www-form-urlencoded");

        var response = await client.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);
        return json.RootElement.GetProperty("access_token").GetString();
    }

    private async Task<List<ZoomParticipant>> GetMeetingParticipantsAsync(string meetingUUID)
    {
        var accessToken = await GetAccessTokenAsync();
        var encodedUUID = HttpUtility.UrlEncode(meetingUUID);
        var url = $"https://api.zoom.us/v2/report/meetings/{encodedUUID}/participants";

        var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await client.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();

        var json = JsonDocument.Parse(content);
        var participants = new List<ZoomParticipant>();

        foreach (var item in json.RootElement.GetProperty("participants").EnumerateArray())
        {
            participants.Add(new ZoomParticipant
            {
                Name = item.GetProperty("name").GetString(),
                Email = item.GetProperty("user_email").GetString(),
                JoinTime = item.GetProperty("join_time").GetDateTime(),
                LeaveTime = item.GetProperty("leave_time").GetDateTime(),
                Duration = item.GetProperty("duration").GetInt32()
            });
        }

        return participants;
    }

    private class ZoomParticipant
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime JoinTime { get; set; }
        public DateTime LeaveTime { get; set; }
        public int Duration { get; set; } // in seconds
    }







    [HttpPost("create-meeting/{userEmail}")]
    public async Task<IActionResult> CreateMeeting(string userEmail)
    {
        var accessToken = await GetZoomAccessTokenAsync();

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var meeting = new
        {
            topic = "Test Meeting",
            type = 2,
            start_time = DateTime.UtcNow.AddHours(1).ToString("yyyy-MM-ddTHH:mm:ssZ"),
            duration = 60,
            timezone = "UTC",
            settings = new
            {
                host_video = true,
                participant_video = true,
                join_before_host = true
            }
        };

        var json = JsonSerializer.Serialize(meeting);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await client.PostAsync($"https://api.zoom.us/v2/users/{userEmail}/meetings", content);
        var result = await response.Content.ReadAsStringAsync();

        return Content(result, "application/json");
    }

    private async Task<string> GetZoomAccessTokenAsync()
    {
        var clientId = "kv9ZQ1IaTHGGNXIqpvUoIg";
        var clientSecret = "8mcmkUivhbiHXaZBq0WT1aFUn3cQbfR3";
        var accountId = "4nxWdzJjQfWNVpaC2RTLKQ";

        var handler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };
        var client = new HttpClient(handler);

        var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

        var content = new StringContent($"grant_type=account_credentials&account_id={accountId}", Encoding.UTF8, "application/x-www-form-urlencoded");
        var response = await client.PostAsync("https://zoom.us/oauth/token", content);
        var responseBody = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(responseBody);
        return doc.RootElement.GetProperty("access_token").GetString();
    }

}