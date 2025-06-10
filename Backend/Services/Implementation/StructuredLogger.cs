using Serilog;
using System.Security.Claims;

namespace Backend.Services.Implementation;

public class StructuredLogger : IStructuredLogger
{
    #region    Fields
    private readonly Serilog.ILogger _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    #endregion

    #region     Constructor
    public StructuredLogger(IHttpContextAccessor httpContextAccessor)
    {
        _logger = Log.Logger;
        _httpContextAccessor = httpContextAccessor;
    }
    #endregion

    #region    Methods
    public void LogInfo(string message)
    {
        var user = _httpContextAccessor.HttpContext?.User;

        var userName = user?.Identity?.IsAuthenticated == true
            ? user.Identity.Name
            : "Anonymous";

        var userRole = user?.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        _logger
            .ForContext("UserName", userName)
            .ForContext("UserRole", userRole)
            .Information(message);
    }
    #endregion
}