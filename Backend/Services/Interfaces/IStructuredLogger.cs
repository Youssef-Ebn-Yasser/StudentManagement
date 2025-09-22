namespace Backend.Services.Interfaces;

public interface IStructuredLogger
{
    public Task LogInfo(string message, string email = "", EnLevel level = EnLevel.Information, EnLogType logType = EnLogType.Normal);
}