namespace Backend.Entities;


[Table("SystemLogs")]
public class SystemLog
{
    [Key]
    public int Id { get; set; }
    public string? Email { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
    public string? Message { get; set; }
    public string? MessageTemplate { get; set; } = string.Empty;
    public string? Properties { get; set; }
    public string? Exception { get; set; }
    public DateTime? Timestamp { get; set; } = DateTime.UtcNow;
    public EnLogType? LogType { get; set; }
    public string? Level { get; set; }
    public string? IPAddress { get; set; }
    public string? Path { get; set; }
    public string? Method { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? Country { get; set; }
    public string? Location { get; set; }   // Latitude,Longitude
    public string? Organization { get; set; }  // ISP or organization
    public EnLogHappenIn? LogHappenIn { get; set; }
    public int? LogHappenInId { get; set; }
}