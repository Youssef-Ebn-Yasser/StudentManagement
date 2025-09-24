namespace Backend.DTOs.LogDTOs;

public class SystemLogDto
{
    public SystemLogDto()
    {
        SystemLogDetailsDtos = new List<SystemLogDetailsDto>();
    }
    public int NumberOfTotalLogs { get; set; }
    public int NumberOfTotalLogsLastDay { get; set; }

    public List<SystemLogDetailsDto> SystemLogDetailsDtos { get; set; }

}
public class SystemLogDetailsDto
{
    public string? Email { get; set; }
    public string? Message { get; set; }
    public string? UserRole { get; set; }
    public DateTime? Timestamp { get; set; }
    public string? Level { get; set; }
    public EnLogType? LogType { get; set; }
    public string? City { get; set; }
    public string? IPAddress { get; set; }
}