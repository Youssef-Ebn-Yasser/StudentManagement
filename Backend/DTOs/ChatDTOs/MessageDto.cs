namespace Backend.DTOs.ChatDTOs;

public class MessageDto
{
    public int Id { get; set; }
    public int ChatRoomId { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; } // Display name of sender
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
}