using Serilog;
using System.Security.Claims;

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
    public async Task LogInfo(string message, string email = "", EnLevel level = EnLevel.Information, EnLogType logType = EnLogType.Normal)
    {
        var user = _httpContextAccessor.HttpContext?.User;

        var userName = user?.Identity?.IsAuthenticated == true
            ? user.Identity.Name
            : "Anonymous";

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


        switch (level)
        {
            case EnLevel.Information:
                _logger
                    .ForContext("UserName", userName)
                    .ForContext("UserRole", userRole)
                    .ForContext("LogType", (int)logType)
                    .ForContext("Email", email)
                    .Information(message);
                break;

            case EnLevel.Error:
                _logger
                    .ForContext("UserName", userName)
                    .ForContext("UserRole", userRole)
                    .ForContext("LogType", (int)logType)
                    .Error(message);
                break;

            case EnLevel.Warnning:
                _logger
                    .ForContext("UserName", userName)
                    .ForContext("UserRole", userRole)
                    .ForContext("LogType", (int)logType)
                    .Warning(message);
                break;
        }
    }
    #endregion
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