namespace Backend.MiddleWare;

public class ActivityLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public ActivityLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, ApplicationDbContext db)
    {
        if (context.User.Identity.IsAuthenticated)
        {
            var log = new ActivityLog
            {
                UserId = context.User.Identity.Name ?? "no name",
                ActionType = "HttpRequest",
                Description = $"Visited {context.Request.Path}",
                Url = context.Request.Path,
                IpAddress = context.Connection.RemoteIpAddress?.ToString() ?? "can not get ip address",
                UserAgent = context.Request.Headers["User-Agent"].ToString(),
                Timestamp = DateTime.UtcNow
            };

            db.ActivityLogs.Add(log);
            await db.SaveChangesAsync();
        }

        await _next(context);
    }
}


public class ActivityLog
{
    public int Id { get; set; }
    public string UserId { get; set; }          // Which user
    public string ActionType { get; set; }      // e.g. "ViewCourse", "WatchLesson"
    public string Description { get; set; }     // e.g. "User visited course: C# Basics"
    public string Url { get; set; }             // Optional: "/courses/5"
    public string IpAddress { get; set; }       // User’s IP
    public string UserAgent { get; set; }       // Browser/Device info
    public DateTime Timestamp { get; set; }
}