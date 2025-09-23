namespace Backend.Services.Interfaces;

public interface IStructuredLogger
{
    public Task LogInfo(string? message, string? email = "", string? logsIn = "",
    EnLevel? level = EnLevel.Information, EnLogType? logType = EnLogType.Normal, EnLogHappenIn? logHappenIn = EnLogHappenIn.NotDetermine, int? HappenInId = null);
    public Task LogInfo(LogInfoData logInfoData);
}