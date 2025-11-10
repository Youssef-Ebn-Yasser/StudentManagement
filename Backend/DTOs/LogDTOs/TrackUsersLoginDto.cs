namespace Backend.DTOs.LogDTOs;

public class TrackUsersLoginDto
{
    public string? Email { get; set; }
    public string? Message { get; set; }
    public string? Role { get; set; }
    public DateTime? Time { get; set; }
    public string? Action { get; set; }
}