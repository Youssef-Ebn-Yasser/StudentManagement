//using System.Net.Http.Headers;
//using System.Text.Json;

//namespace Backend.Controllers;

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

//    [HttpPost("create-meeting")]
//    public async Task<IActionResult> CreateMeeting([FromBody] string accessToken)
//    {
//        var client = _httpClientFactory.CreateClient();
//        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

//        var meetingDetails = new
//        {
//            topic = "Test Meeting",
//            type = 1
//        };

//        var json = JsonSerializer.Serialize(meetingDetails);
//        var response = await client.PostAsync("https://api.zoom.us/v2/users/me/meetings", new StringContent(json, Encoding.UTF8, "application/json"));
//        var content = await response.Content.ReadAsStringAsync();
//        return Ok(content);
//    }
//    public class ZoomOptions
//    {
//        public string ClientId { get; set; }
//        public string ClientSecret { get; set; }
//        public string RedirectUri { get; set; }
//    }
//}
