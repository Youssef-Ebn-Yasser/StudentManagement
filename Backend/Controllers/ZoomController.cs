//using Newtonsoft.Json;
//using System.Net.Http.Headers;

//namespace Backend.Controllers;
//[Route("api/[controller]")]
//public class ZoomController : ControllerBase
//{
//    private readonly IConfiguration _config;
//    private readonly IHttpClientFactory _httpClientFactory;

//    public ZoomController(IConfiguration config, IHttpClientFactory httpClientFactory)
//    {
//        _config = config;
//        _httpClientFactory = httpClientFactory;
//    }

//    [HttpGet("authorize")]
//    public IActionResult Authorize()
//    {
//        var clientId = _config["Zoom:ClientId"];
//        var redirectUri = _config["Zoom:RedirectUri"];
//        var url = $"https://zoom.us/oauth/authorize?response_type=code&client_id={clientId}&redirect_uri={redirectUri}";
//        return Redirect(url);
//    }

//    [HttpGet("callback")]
//    public async Task<IActionResult> Callback([FromQuery] string code)
//    {
//        var client = _httpClientFactory.CreateClient();
//        var clientId = _config["Zoom:ClientId"];
//        var clientSecret = _config["Zoom:ClientSecret"];
//        var redirectUri = _config["Zoom:RedirectUri"];

//        var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
//        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

//        var requestBody = new Dictionary<string, string>
//        {
//        { "grant_type", "authorization_code" },
//        { "code", code },
//        { "redirect_uri", redirectUri }
//        };

//        var response = await client.PostAsync("https://zoom.us/oauth/token", new FormUrlEncodedContent(requestBody));
//        var content = await response.Content.ReadAsStringAsync();
//        return Ok(content);
//    }
//    [HttpPost("zoom/token")]
//    public async Task<IActionResult> GetZoomToken([FromQuery] string code)
//    {
//        var client = new HttpClient();
//        var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes("gU7AQLlkSAyZQEzFkp6gA:lX1Mc9HDxRxqno35skcEn1a6foHRME9L"));

//        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

//        var content = new FormUrlEncodedContent(new[]
//        {
//        new KeyValuePair<string, string>("grant_type", "authorization_code"),
//        new KeyValuePair<string, string>("code", code),
//        new KeyValuePair<string, string>("redirect_uri", "https://localhost:5001/zoom/callback")
//    });

//        var response = await client.PostAsync("https://zoom.us/oauth/token", content);
//        var responseString = await response.Content.ReadAsStringAsync();

//        return Ok(responseString); // includes access_token and refresh_token
//    }

//    [HttpPost("zoom/meetings")]
//    public async Task<IActionResult> CreateZoomMeeting([FromBody] ZoomMeetingRequest request)
//    {
//        if (string.IsNullOrWhiteSpace(request.AccessToken))
//            return BadRequest("Access token is required.");

//        var client = _httpClientFactory.CreateClient();

//        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", request.AccessToken);
//        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

//        var meetingPayload = new
//        {
//            topic = "My Group Session",
//            type = 2, // 2 = Scheduled Meeting
//            start_time = DateTime.UtcNow.AddMinutes(10).ToString("yyyy-MM-ddTHH:mm:ssZ"),
//            duration = 30,
//            timezone = "UTC",
//            settings = new
//            {
//                approval_type = 1, // Manually approve
//                registration_type = 1, // Once per meeting
//                host_video = true,
//                participant_video = true
//            }
//        };

//        var jsonContent = new StringContent(JsonConvert.SerializeObject(meetingPayload), Encoding.UTF8, "application/json");

//        var response = await client.PostAsync("https://api.zoom.us/v2/users/me/meetings", jsonContent);
//        var content = await response.Content.ReadAsStringAsync();

//        if (!response.IsSuccessStatusCode)
//            return StatusCode((int)response.StatusCode, content);

//        var result = JsonConvert.DeserializeObject<dynamic>(content);
//        return Ok(new
//        {
//            join_url = result.join_url,
//            start_url = result.start_url
//        });
//    }
//    [HttpPost("generate-signature")]
//    public IActionResult GenerateSignature([FromBody] ZoomSignatureRequest request)
//    {
//        var sdkKey = _config["Zoom:SDKKey"];
//        var sdkSecret = _config["Zoom:SDKSecret"];

//        var ts = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds - 30000;
//        var message = $"{sdkKey}{request.MeetingNumber}{ts}{request.Role}";
//        var encoding = new System.Text.ASCIIEncoding();
//        var keyByte = encoding.GetBytes(sdkSecret);
//        var messageBytes = encoding.GetBytes(message);
//        using var hmacsha256 = new System.Security.Cryptography.HMACSHA256(keyByte);
//        var hashMessage = hmacsha256.ComputeHash(messageBytes);
//        var msg = Convert.ToBase64String(hashMessage);

//        var token = new
//        {
//            sdkKey = sdkKey,
//            mn = request.MeetingNumber,
//            role = request.Role,
//            iat = (ts - 30000) / 1000,
//            exp = (ts + 2 * 60 * 60 * 1000) / 1000,
//            tokenExp = (ts + 2 * 60 * 60 * 1000) / 1000
//        };

//        var header = Convert.ToBase64String(encoding.GetBytes("{\"alg\":\"HS256\",\"typ\":\"JWT\"}"));
//        var payload = Convert.ToBase64String(encoding.GetBytes(JsonConvert.SerializeObject(token)));
//        var signature = $"{header}.{payload}.{Convert.ToBase64String(hmacsha256.ComputeHash(encoding.GetBytes($"{header}.{payload}")))}";
//        var finalSig = Convert.ToBase64String(encoding.GetBytes(signature)).TrimEnd('=').Replace('+', '-').Replace('/', '_');

//        return Ok(new { signature = finalSig });
//    }
//    public class ZoomSignatureRequest
//    {
//        public string MeetingNumber { get; set; }
//        public int Role { get; set; } // 0 = attendee, 1 = host
//    }
//    public class ZoomMeetingRequest
//    {
//        public string AccessToken { get; set; }
//    }
//    public class ZoomOptions
//    {
//        public string ClientId { get; set; }
//        public string ClientSecret { get; set; }
//        public string RedirectUri { get; set; }
//    }
//}
