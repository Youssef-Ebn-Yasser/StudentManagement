namespace Backend.Services.Implementation;

public class StructuredLogger : IStructuredLogger
{
    #region    Fields
    private readonly Serilog.ILogger _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUnitOfWork _unitOfWork;
    #endregion

    #region     Constructor
    public StructuredLogger(IHttpContextAccessor httpContextAccessor, IUnitOfWork unitOfWork)
    {
        _logger = Log.Logger;
        _httpContextAccessor = httpContextAccessor;
        _unitOfWork = unitOfWork;
    }
    #endregion

    #region    Methods

    public class LogInfoData
    {
        public int? HappenInId { get; set; }
        public string? Message { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? LogsIn { get; set; } = string.Empty;
        public EnLevel? Level { get; set; } = EnLevel.Information;
        public EnLogType? TypeLog { get; set; } = EnLogType.Normal;
        public EnLogHappenIn? LoghappenIn { get; set; } = EnLogHappenIn.NotDetermine;
    }

    public async Task LogInfo(LogInfoData logInfoData)
    {
        await LogInfo(logInfoData.Message, logInfoData.Email, logInfoData.LogsIn,
        logInfoData.Level, logInfoData.TypeLog = EnLogType.Normal, logInfoData.LoghappenIn, logInfoData.HappenInId);
    }
    public async Task LogInfo(string? message, string? email = "", string? logsIn = "",
    EnLevel? level = EnLevel.Information, EnLogType? logType = EnLogType.Normal, EnLogHappenIn? logHappenIn = EnLogHappenIn.NotDetermine, int? HappenInId = null)
    {
        #region     request
        string? pageUrl = _httpContextAccessor.HttpContext?.Request.Headers["X-Page-Url"].ToString();

        var url = pageUrl;
        #endregion



        var ipAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Unknown";
        var path = _httpContextAccessor.HttpContext?.Request?.Path.ToString() ?? "Unknown";
        var method = _httpContextAccessor.HttpContext?.Request?.Method ?? "Unknown";
        var info = await GetRegionFromIpAsync(ipAddress);
        //var url = _httpContextAccessor.HttpContext?.Request.Path;
        // var url = $"{_httpContextAccessor.HttpContext?.Request?.Scheme}://{_httpContextAccessor.HttpContext?.Request?.Host}{_httpContextAccessor.HttpContext?.Request?.Path}{_httpContextAccessor.HttpContext?.Request?.QueryString}";
        var user = _httpContextAccessor.HttpContext?.User;

        var userName = user?.Identity?.IsAuthenticated == true
            ? user.Identity.Name
            : "Anonymous";


        string mail = "";
        string userId = "";
        if (user != null)
        {
            mail = user.FindFirst(ClaimTypes.Email)?.Value;
            userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }


        var userRole = user?.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userRole == "Unknown")
        {
            var role = await _unitOfWork.Repository<User>()
                                               .GetTableNoTracking()
                                               .Where(u => u.Email == email)
                                               .Select(u => u.UserType)
                                               .FirstOrDefaultAsync();

            if (role != null)
                userRole = role;
        }

        email = mail;

        try
        {


            var logContext = _logger
        .ForContext("UserName", userName)
        .ForContext("UserRole", userRole)
        .ForContext("LogType", (int?)logType ?? default)
        .ForContext("Email", email)
        .ForContext("IPAddress", ipAddress)
        .ForContext("Path", path)
        .ForContext("Method", method)
        .ForContext("City", info.City)
        .ForContext("Region", info.Region)
        .ForContext("Country", info.Country)
        .ForContext("Location", info.Loc)
        .ForContext("Organization", info.Org)
            .ForContext("LogHappenIn", (int?)(logHappenIn ?? default))
            .ForContext("LogHappenInId", HappenInId)
            .ForContext("URl", url);

            level = level ?? default;
            switch (level)
            {
                case EnLevel.Information:
                    logContext.Information(message);
                    break;

                case EnLevel.Error:
                    logContext.Error(message);
                    break;

                case EnLevel.Warnning:
                    logContext.Warning(message);
                    break;
            }
        }

        catch (Exception ex)
        {

        }

    }
    private async Task<IpInfo> GetRegionFromIpAsync(string ip)
    {
        using var httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(5) // avoid hanging requests
        };

        try
        {
            var response = await httpClient.GetStringAsync($"https://ipinfo.io/{ip}/json");
            return JsonConvert.DeserializeObject<IpInfo>(response);
        }
        catch (HttpRequestException)
        {
            // network / DNS / blocked service issue
            return new IpInfo
            {
                Ip = ip,
                City = "Unknown",
                Region = "Unknown",
                Country = "Unknown",
                Loc = "Unknown",
                Org = "Unknown",
                Timezone = "Unknown"
            };
        }
        catch (TaskCanceledException)
        {
            // timeout
            return new IpInfo
            {
                Ip = ip,
                City = "Unknown",
                Region = "Unknown",
                Country = "Unknown",
                Loc = "Unknown",
                Org = "Unknown",
                Timezone = "Unknown"
            };
        }
    }

    #endregion
}
public enum EnLogHappenIn
{
    NotDetermine = 0,
    Course = 1,
    Lession = 2,
    Material = 3,
    teacher = 4,
    Vedio = 5,
    category = 6,
    Student = 7,
}
public class IpInfo
{
    public string Ip { get; set; }
    public string City { get; set; }
    public string Region { get; set; }
    public string Country { get; set; }
    public string Loc { get; set; }
    public string Org { get; set; }
    public string Timezone { get; set; }
}

public enum EnLogType
{
    Normal = 1,
    Logs = 2,
}


public enum EnLevel
{
    Information = 1,
    Warnning = 2,
    Error = 3,
}