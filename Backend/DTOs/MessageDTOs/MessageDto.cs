namespace Backend.DTOs.MessageDTOs;

public class MessageDto
{
    public string content { get; set; } = string.Empty;
    public int SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int CourseId { get; set; }
}