//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Net.Http.Headers;

//namespace Backend.Controllers
//{
//    [ApiController]
//    [Route("api/zoom")] // Base route (must be lowercase)
//    public class ZoomController : ControllerBase
//    {
//        private readonly IConfiguration _config;
//        private static string? _accessToken;
//        private static string? _refreshToken;

//        public ZoomController(IConfiguration config)
//        {
//            _config = config;
//        }

//        [HttpGet("authorize")]
//        public IActionResult Authorize()
//        {
//            var clientId = _config["Zoom:ClientId"];
//            var redirectUri = Uri.EscapeDataString(_config["Zoom:RedirectUri"]);
//            var url = $"https://zoom.us/oauth/authorize?response_type=code&client_id={clientId}&redirect_uri={redirectUri}";
//            return Redirect(url);
//        }

//        [HttpGet("callback")] // Full path: api/zoom/callback
//        public async Task<IActionResult> Callback([FromQuery] string code)
//        {
//            using var client = new HttpClient();

//            // Prepare token request
//            var request = new HttpRequestMessage(HttpMethod.Post, "https://zoom.us/oauth/token");
//            request.Headers.Authorization = new AuthenticationHeaderValue(
//                "Basic",
//                Convert.ToBase64String(Encoding.UTF8.GetBytes(
//                    $"{_config["Zoom:ClientId"]}:{_config["Zoom:ClientSecret"]}"
//                ))
//            );

//            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
//            {
//                {"grant_type", "authorization_code"},
//                {"code", code},
//                {"redirect_uri", _config["Zoom:RedirectUri"]}
//            });

//            // Get tokens from Zoom
//            var response = await client.SendAsync(request);
//            var content = await response.Content.ReadAsStringAsync();

//            if (!response.IsSuccessStatusCode)
//            {
//                return BadRequest($"Zoom token request failed: {content}");
//            }

//            // Store tokens
//            var tokenData = JsonConvert.DeserializeObject<dynamic>(content);
//            _accessToken = tokenData.access_token;
//            _refreshToken = tokenData.refresh_token;

//            return Ok(new
//            {
//                message = "Zoom authorization successful",
//                access_token = _accessToken,
//                expires_in = tokenData.expires_in
//            });
//        }

//        [HttpPost("create-meeting")]
//        public async Task<IActionResult> CreateMeeting([FromBody] MeetingRequest request)
//        {
//            try
//            {
//                if (_accessToken == null)
//                    return Unauthorized(new { message = "Zoom not authorized" });

//                using var client = new HttpClient();
//                client.DefaultRequestHeaders.Authorization =
//                    new AuthenticationHeaderValue("Bearer", _accessToken);

//                var meetingPayload = new
//                {
//                    topic = request.Topic,
//                    type = request.StartTime.HasValue ? 2 : 1 // scheduled or instant
//,                                                                   //request.IsRecurring ? 8 : (request.StartTime.HasValue ? 2 : 1),
//                    start_time = request.StartTime?.ToString("yyyy-MM-ddTHH:mm:ss"),
//                    duration = request.Duration,
//                    timezone = "UTC",
//                    settings = new
//                    {
//                        join_before_host = true,
//                        waiting_room = false
//                    } ,


//                };

//                var response = await client.PostAsync(
//                    "https://api.zoom.us/v2/users/me/meetings",
//                    new StringContent(JsonConvert.SerializeObject(meetingPayload),
//                    Encoding.UTF8,
//                    "application/json"
//                ));

//                var responseContent = await response.Content.ReadAsStringAsync();

//                if (!response.IsSuccessStatusCode)
//                {
//                    return StatusCode((int)response.StatusCode, new
//                    {
//                        message = "Zoom API error",
//                        error = responseContent
//                    });
//                }

//                var meetingInfo = JObject.Parse(responseContent);

//                if (meetingInfo["join_url"] == null)
//                {
//                    return BadRequest(new
//                    {
//                        message = "Zoom didn't return a join URL",
//                        fullResponse = meetingInfo
//                    });
//                }

//                var final = new
//                {
//                    Topic = request.Topic,
//                    JoinUrl = meetingInfo["join_url"].ToString(),
//                    MeetingId = meetingInfo["id"].ToString(),
//                    StartTime = meetingInfo["start_time"]?.ToString(),
//                    Duration = request.Duration

//                };
//                return Ok(new
//                {
//                    Topic = request.Topic,
//                    JoinUrl = meetingInfo["join_url"].ToString(),
//                    MeetingId = meetingInfo["id"].ToString(),
//                    StartTime = meetingInfo["start_time"]?.ToString(),
//                    Duration = request.Duration,
//                    IsRecurring = request.IsRecurring // Add this line
//                });
//            }

//            catch (Exception ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "Internal server error",
//                    error = ex.Message
//                });
//            }
//        }

//        [HttpGet("check-auth")]
//        public IActionResult CheckAuth()
//        {
//            return Ok(new
//            {
//                is_authenticated = _accessToken != null,
//                token_expires_in = _refreshToken != null ? "Valid" : "Expired"
//            });
//        }
//    }

//    public class MeetingRequest
//    {
//        public string Topic { get; set; } = "My Meeting";
//        public DateTime? StartTime { get; set; }  // Nullable for no fixed time
//        public int Duration { get; set; } = 30;
//        public bool IsRecurring { get; set; }
//        public string RecurrenceType { get; set; } = "daily"; // daily/weekly/monthly
//        public int RecurrenceInterval { get; set; } = 1;
//        public int Occurrences { get; set; } = 5;
//    }
//}