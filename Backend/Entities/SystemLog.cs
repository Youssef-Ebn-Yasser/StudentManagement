namespace Backend.Entities;


[Table("SystemLogs")]
public class SystemLog
{
    [Key]
    public int Id { get; set; }
    public string Email { get; set; }
    public string Message { get; set; }
    public string MessageTemplate { get; set; } = string.Empty;
    public string? UserName { get; set; }

    public string? UserRole { get; set; }
    public string? Properties { get; set; }
    public string? Exception { get; set; }
    public DateTime Timestamp { get; set; }
    public EnLogType? LogType { get; set; }
    public string Level { get; set; }
}