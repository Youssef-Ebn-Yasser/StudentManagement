using System.Text.Json;

namespace Backend.Services.Implementation;

public class MeetingService : ResponseHandler, IMeetingService
{
    #region    Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _config;
    //private static string? _accessToken;
    #endregion

    #region   Constructor
    public MeetingService(IConfiguration config, IUnitOfWork unitOfWork)
    {
        _config = config;
        _unitOfWork = unitOfWork;
    }
    #endregion

    #region   Handle Methods
    //public string Authorize()
    //{
    //    var clientId = _config["Zoom:ClientId"];
    //    var redirectUri = Uri.EscapeDataString(_config["Zoom:RedirectUri"] ?? string.Empty);
    //    var url = $"https://zoom.us/oauth/authorize?response_type=code&client_id={clientId}&redirect_uri={redirectUri}";

    //    return url;
    //}
    //public async Task<string> Callback(string code)
    //{
    //    using var client = new HttpClient();

    //    // Prepare token request
    //    var request = new HttpRequestMessage(HttpMethod.Post, "https://zoom.us/oauth/token");
    //    request.Headers.Authorization = new AuthenticationHeaderValue(
    //        "Basic",
    //        Convert.ToBase64String(Encoding.UTF8.GetBytes(
    //            $"{_config["Zoom:ClientId"]}:{_config["Zoom:ClientSecret"]}"
    //        ))
    //    );

    //    request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
    //        {
    //            {"grant_type", "authorization_code"},
    //            {"code", code},
    //            {"redirect_uri", _config["Zoom:RedirectUri"] ?? string.Empty}
    //        });

    //    // Get tokens from Zoom
    //    var response = await client.SendAsync(request);
    //    var content = await response.Content.ReadAsStringAsync();

    //    if (!response.IsSuccessStatusCode)
    //    {
    //        // Log the error content for debugging
    //        Console.WriteLine($"Zoom token request failed: {content}");
    //        return $"Zoom token request failed: {content}";
    //    }

    //    // Store tokens
    //    var tokenData = JsonConvert.DeserializeObject<dynamic>(content);
    //    _accessToken = tokenData?.access_token?.ToString();

    //    // Redirect back to the frontend, indicating success
    //    var frontendBaseUrl = _config["Zoom:SuccessRedirectUri"];
    //    if (!string.IsNullOrEmpty(frontendBaseUrl))
    //    {
    //        return $"{frontendBaseUrl}";
    //    }

    //    // Fallback if no redirect URL is configured
    //    return $"{frontendBaseUrl}/error";
    //}

    //public (bool, string) CheckAuth()
    //{
    //    bool is_authenticated = _accessToken != null;
    //    string token_status = _accessToken != null ? "Active" : "Inactive";
    //    return (is_authenticated, token_status);
    //}

    //  // old way 
    //public async Task<Response<string>> CreateMeeting(MeetingRequestDto request)
    //{
    //    // if course not exist return badrequest
    //    var course = await _unitOfWork.Repository<Course>().GetTableNoTracking().AnyAsync(c => c.Id == request.CourseId);
    //    if (!course) return BadRequest<string>("no course with this id exist");


    //    if (_accessToken == null)
    //        return UnAuthorized<string>("Zoom not authorized. Please connect with Zoom first.");

    //    using var client = new HttpClient();
    //    client.DefaultRequestHeaders.Authorization =
    //        new AuthenticationHeaderValue("Bearer", _accessToken);



    //    var meetingPayload = SetPayloadOptions(request);
    //    if (meetingPayload == null) return BadRequest<string>("Data has an error enter valid data");

    //    var response = await client.PostAsync(
    //        "https://api.zoom.us/v2/users/me/meetings",
    //        new StringContent(meetingPayload.ToString(Formatting.None), // Use Formatting.None for compact JSON
    //        Encoding.UTF8,
    //        "application/json"
    //    ));

    //    var responseContent = await response.Content.ReadAsStringAsync();

    //    if (!response.IsSuccessStatusCode)
    //        return BadRequest<string>("Response error from zoom can not create a meeting");


    //    var meetingInfo = JObject.Parse(responseContent);

    //    // make sure there is a link url
    //    if (meetingInfo["join_url"] == null)
    //        return BadRequest<string>("Zoom didn't return a join URL");

    //    // save in Db
    //    var saveResult = await SaveMeetingDetailsInDB(request, meetingInfo);

    //    if (!saveResult)
    //        BadRequest<string>("can not save in Db but link created big problem....");

    //    return Success("Created Link Success");
    //}


    public async Task<Response<string>> CreateMeeting(MeetingRequestDto request)
    {
        var zoomEmail = _config["Zoom:zoomEmail"];

        // if course not exist return badrequest
        var course = await _unitOfWork.Repository<Course>().GetTableNoTracking().AnyAsync(c => c.Id == request.CourseId);
        if (!course) return BadRequest<string>("no course with this id exist");

        var _accessToken = await GetAccessTokenAsync();
        if (_accessToken == null)
            return UnAuthorized<string>("Zoom not authorized. Please connect with Zoom first.");

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);


        var meetingPayload = SetPayloadOptions(request);
        if (meetingPayload == null) return BadRequest<string>("Data has an error enter valid data");


        var response = await client.PostAsJsonAsync($"https://api.zoom.us/v2/users/{zoomEmail}/meetings", meetingPayload);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return BadRequest<string>("Response error from zoom can not create a meeting");


        var meetingInfo = JObject.Parse(responseContent);

        // make sure there is a link url
        if (meetingInfo["join_url"] == null)
            return BadRequest<string>("Zoom didn't return a join URL");

        // save in Db
        var saveResult = await SaveMeetingDetailsInDB(request, meetingInfo);

        if (!saveResult)
            BadRequest<string>("can not save in Db but link created big problem....");

        return Success("Created Link Success");
    }
    public async Task<Response<List<MeetingDetailsResponse>>> GetMeetingsForCourse(int courseId)
    {
        List<Meeting> meetings = await _unitOfWork.Repository<Meeting>()
                                                   .GetTableNoTracking()
                                                   .Where(m => m.CourseID == courseId)
                                                   .ToListAsync();
        var list = new List<MeetingDetailsResponse>();
        foreach (var meeting in meetings)
        {

            var meetingResult = new MeetingDetailsResponse()
            {
                Duration = meeting.Duration,
                JoinUrl = meeting.JoinUrl,
                Password = meeting.Password,
                StartTime = meeting.StartTime,
                Topic = meeting.Topic,
                Type = meeting.Type,
                ZoomMeetingId = meeting.ZoomMeetingId,
            };

            if (meeting.RecurrenceDetailsJson != null)
            {
                var recurrenceDetailsJson = JsonConvert.DeserializeObject<Recurrence>(meeting.RecurrenceDetailsJson);
                if (recurrenceDetailsJson != null)
                {
                    meetingResult.MonthlyWeek = recurrenceDetailsJson.MonthlyWeek;
                    meetingResult.MonthlyDay = recurrenceDetailsJson.MonthlyDay;
                    meetingResult.MonthlyWeekDay = recurrenceDetailsJson.MonthlyWeekDay;
                    meetingResult.RepeatInterval = recurrenceDetailsJson.RepeatInterval;
                    meetingResult.WeeklyDays = recurrenceDetailsJson.WeeklyDays;
                }
            }
            if (meeting != null && meeting.WeeklyDaysWithDateSerialized != null)
                meetingResult.WeeklyDaysWithDate = JsonConvert.DeserializeObject<Dictionary<string, string>>(meeting.WeeklyDaysWithDateSerialized);

            list.Add(meetingResult);
        }

        return Success(list);
    }
    private async Task<bool> SaveMeetingDetailsInDB(MeetingRequestDto request, JObject meetingInfo)
    {
        // Save meeting details to our simulated database
        var savedMeeting = new Meeting
        {
            ZoomMeetingId = meetingInfo["id"]?.ToString() ?? string.Empty,
            Topic = request.Topic,
            JoinUrl = meetingInfo["join_url"]?.ToString() ?? string.Empty,
            Password = request.Password,
            Type = (EnMeetingType)request.Type,
            StartTime = request.StartTime,
            Duration = request.Duration,
            MuteParticipantsUponEntry = request.MuteParticipantsUponEntry,
            AutoRecording = request.AutoRecording,
            CreatedAt = DateTime.UtcNow,
            CourseID = request.CourseId,
        };


        // Store recurrence details as JSON string for type 8
        if (request.Type == 8 && request.Recurrence != null)
        {
            savedMeeting.RecurrenceDetailsJson = JsonConvert.SerializeObject(request.Recurrence);
            savedMeeting.Occurrences = request.Recurrence.EndTimes;
            savedMeeting.WeeklyDaysWithDateSerialized = JsonConvert.SerializeObject(request.Recurrence.WeeklyDaysWithDate);
        }

        // real save to database
        await _unitOfWork.Repository<Meeting>().AddAsync(savedMeeting);
        var result = _unitOfWork.Complete();

        return result > 0 ? true : false;
    }
    private JObject? SetPayloadOptions(MeetingRequestDto request)
    {
        // Construct the Zoom API payload dynamically based on meeting type and settings
        var meetingPayload = new JObject
        {
            {"topic", request.Topic},
            {"type", request.Type}, // 1: Instant, 2: Scheduled, 8: Recurring fixed time
            {"duration", request.Duration},
            {"timezone", "UTC"}, // Or get from request if needed

            // Meeting settings
            {"settings", new JObject
                {
                    { "jbh_time", 10 },
                    {"join_before_host", true},
                    {"waiting_room", false},
                    {"mute_participants_upon_entry", request.MuteParticipantsUponEntry},
                    {"auto_recording", request.AutoRecording}, // "local", "cloud", or null
                    { "recording_privilege", "all" },
                }
            }
        };

        // Add password if provided
        if (!string.IsNullOrEmpty(request.Password))
            ((JObject)meetingPayload["settings"]!).Add("password", request.Password);

        // Add start_time for Scheduled (Type 2) and Recurring (Type 8) meetings
        if (request.Type == 2 || request.Type == 8)   // add startTime bigger than time now
        {
            if (request.StartTime == null || request.StartTime <= DateTime.Now)
                return null;

            meetingPayload.Add("start_time", request.StartTime?.ToString("yyyy-MM-ddTHH:mm:ss"));
        }
        // Add recurrence details for Recurring meetings (Type 8)
        if (request.Type == 8 && request.Recurrence != null)
        {
            var recurrencePayload = new JObject
            {
                {"type", request.Recurrence.Type}, // 1: Daily, 2: Weekly, 3: Monthly
                {"repeat_interval", request.Recurrence.RepeatInterval},
            };

            if (request.Recurrence.EndTimes.HasValue)
            {
                recurrencePayload.Add("end_times", request.Recurrence.EndTimes);
            }
            else if (!string.IsNullOrEmpty(request.Recurrence.EndDate))
            {
                recurrencePayload.Add("end_date_time", request.Recurrence.EndDate + "T23:59:59Z"); // Zoom expects datetime for end_date_time
            }

            if (request.Recurrence.Type == 2 && request.Recurrence.WeeklyDays != null && request.Recurrence.WeeklyDays.Length > 0)
            {
                recurrencePayload.Add("weekly_days", string.Join(",", request.Recurrence.WeeklyDays));
            }
            else if (request.Recurrence.Type == 3)
            {
                if (request.Recurrence.MonthlyDay.HasValue)
                {
                    recurrencePayload.Add("monthly_day", request.Recurrence.MonthlyDay);
                }
                else if (request.Recurrence.MonthlyWeek.HasValue && request.Recurrence.MonthlyWeekDay.HasValue)
                {
                    recurrencePayload.Add("monthly_week", request.Recurrence.MonthlyWeek);
                    recurrencePayload.Add("monthly_week_day", request.Recurrence.MonthlyWeekDay);
                }
            }
            meetingPayload.Add("recurrence", recurrencePayload);
        }
        return meetingPayload;
    }
    private async Task<string> GetAccessTokenAsync()
    {
        var clientId = _config["Zoom:ClientId"];
        var clientSecret = _config["Zoom:ClientSecret"];
        var accountId = _config["Zoom:AccountId"];

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
    #endregion
}