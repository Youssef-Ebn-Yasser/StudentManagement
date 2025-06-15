using System.Globalization;
using System.Security.Cryptography;
using System.Text.Json;

namespace Backend.Controllers;

[ApiController]
[Route("api/zoom")]
public class ZoomController : AppControllerBase
{
    private readonly IMeetingService _meetService;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ApplicationDbContext _context;

    public ZoomController(IMeetingService meetService, IConfiguration configuration, IHttpClientFactory httpClientFactory, ApplicationDbContext context)
    {
        _meetService = meetService;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _context = context;
    }

    //[HttpGet("authorize")]
    //public IActionResult Authorize()
    //{

    //    try
    //    {
    //        var result = _meetService.Authorize();
    //        return Redirect(result);
    //    }
    //    catch
    //    {
    //        return BadRequest("error happen");
    //    }
    //}

    //[HttpGet("callback")] // must match redirect bUrl in zoom marktplace api/zoom/callback
    //public async Task<IActionResult> Callback([FromQuery] string code)
    //{
    //    try
    //    {
    //        var result = await _meetService.Callback(code);
    //        return Redirect(result);
    //    }
    //    catch
    //    {
    //        return BadRequest("error happen");
    //    }
    //}

    //[HttpPost("create-meeting")]
    //public async Task<IActionResult> CreateMeeting([FromBody] MeetingRequestDto request)
    //{
    //    try
    //    {
    //        var result = await _meetService.CreateMeeting(request);

    //        return NewResult(result);
    //    }
    //    catch
    //    {
    //        return BadRequest("error happen");
    //    }
    //}

    //[HttpGet("check-auth")]
    //public IActionResult CheckAuth()
    //{
    //    var result = _meetService.CheckAuth();
    //    return Ok(new
    //    {
    //        is_authenticated = result.Item1,
    //        token_status = result.Item2,
    //    });
    //}





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



        //var zoomEmail = "yh29152@gmail.com"; // host user
        //var accessToken = await GetAccessTokenAsync();

        //using var client = new HttpClient();
        //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        //var body = new
        //{
        //    topic = "Test Meeting",
        //    type = 2,
        //    start_time = DateTime.UtcNow.AddMinutes(5).ToString("yyyy-MM-ddTHH:mm:ssZ"),
        //    duration = 30,
        //    timezone = "UTC",
        //    agenda = "Test Meeting via API",
        //    settings = new
        //    {
        //        join_before_host = true,
        //        jbh_time = 10, // Optional: minutes before host users can join (0–15, only works for type 2)
        //        participant_video = true,
        //        host_video = true
        //    }
        //};

        //var response = await client.PostAsJsonAsync($"https://api.zoom.us/v2/users/{zoomEmail}/meetings", body);
        //var result = await response.Content.ReadAsStringAsync();
        //return Content(result, "application/json");
    }
    private async Task<string> GetAccessTokenAsync()
    {
        var clientId = "kv9ZQ1IaTHGGNXIqpvUoIg";
        var clientSecret = "8mcmkUivhbiHXaZBq0WT1aFUn3cQbfR3";
        var accountId = "4nxWdzJjQfWNVpaC2RTLKQ";

        using var client = new HttpClient();

        var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

        var data = new Dictionary<string, string>
        {
            {"grant_type", "account_credentials"},
            {"account_id", accountId}
        };

        var response = await client.PostAsync("https://zoom.us/oauth/token", new FormUrlEncodedContent(data));
        var content = await response.Content.ReadAsStringAsync();
        var token = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(content).GetProperty("access_token").GetString();
        return token!;
    }

    [HttpGet("zoom/attendance/{meetingId}")]
    public async Task<IActionResult> GetFormattedAttendance(string meetingId)
    {
        var accessToken = await GetAccessTokenAsync();

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var encodedId = Uri.EscapeDataString(meetingId);
        var response = await client.GetAsync(
            $"https://api.zoom.us/v2/report/meetings/{encodedId}/participants?page_size=100");

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }

        var json = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);

        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            var participants = doc.RootElement.GetProperty("participants")
            .EnumerateArray()
            .Select(p => new ZoomParticipant
            {
                NameAr = p.GetProperty("name").GetString(),
                Email = p.GetProperty("user_email").GetString(),
                JoinTime = p.GetProperty("join_time").GetDateTime(),
                LeaveTime = p.GetProperty("leave_time").GetDateTime(),
                Duration = p.GetProperty("duration").GetInt32()
            }).ToList();


            return Ok(participants);
        }
        else
        {
            var participants = doc.RootElement.GetProperty("participants")
            .EnumerateArray()
            .Select(p => new ZoomParticipant
            {
                NameEn = p.GetProperty("name").GetString(),
                Email = p.GetProperty("user_email").GetString(),
                JoinTime = p.GetProperty("join_time").GetDateTime(),
                LeaveTime = p.GetProperty("leave_time").GetDateTime(),
                Duration = p.GetProperty("duration").GetInt32()
            }).ToList();


            return Ok(participants);
        }
    }

    [HttpPost("webhook")]
    public IActionResult HandleWebhook([FromBody] JsonElement payload)
    {
        _context.ChatRooms.Add(new ChatRoom()
        {
            CreatedAt = DateTime.Now,
            LastMessageAt = DateTime.Now,
            StudentId = 86,
            TeacherId = 32,
        });
        _context.SaveChanges();


        var eventType = payload.GetProperty("event").GetString();

        // Step 1: Handle Zoom URL validation
        if (eventType == "endpoint.url_validation")
        {
            var plainToken = payload.GetProperty("payload").GetProperty("plainToken").GetString();
            var encryptedToken = GenerateEncryptedToken(plainToken); // Create this method

            return Ok(new
            {
                plainToken,
                encryptedToken
            });
        }

        // Step 2: Handle normal Zoom events like participant joined/left
        if (eventType == "meeting.participant_joined")
        {
            var participant = payload.GetProperty("payload").GetProperty("object").GetProperty("participant");
            var name = participant.GetProperty("user_name").GetString();
            var email = participant.GetProperty("email").GetString();
            var joinTime = participant.GetProperty("join_time").GetString();

            Console.WriteLine($"Participant Joined: {name} ({email}) at {joinTime}");


            // TODO: Save join info to your database or do other processing
        }
        else if (eventType == "meeting.participant_left")
        {
            var participant = payload.GetProperty("payload").GetProperty("object").GetProperty("participant");
            var name = participant.GetProperty("user_name").GetString();
            var email = participant.GetProperty("email").GetString();
            var leaveTime = participant.GetProperty("leave_time").GetString();

            Console.WriteLine($"Participant Left: {name} ({email}) at {leaveTime}");

            // TODO: Save leave info to your database or do other processing
        }
        return Ok();
    }

    // Simple HMAC SHA256 encryption (replace with your real Zoom app secret token)
    private string GenerateEncryptedToken(string plainToken)
    {
        var secretToken = "rRji1a3FS2q3KrbxwaA-Cg"; // From Zoom Marketplace app settings
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretToken));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(plainToken));
        return Convert.ToBase64String(hash);
    }
}