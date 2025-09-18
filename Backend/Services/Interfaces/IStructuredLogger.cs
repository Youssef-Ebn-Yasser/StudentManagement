namespace Backend.Services.Interfaces;

public interface IStructuredLogger
{
    public void LogInfo(string message, EnLevel level = EnLevel.Information, EnLogType logType = EnLogType.Normal);
}