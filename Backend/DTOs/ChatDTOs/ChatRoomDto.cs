namespace Backend.DTOs.ChatDTOs;

public class ChatRoomDto
{
    public int Id { get; set; }
    public int TeacherId { get; set; }
    public string TeacherName { get; set; } // Display name
    public int StudentId { get; set; }
    public string StudentName { get; set; } // Display name
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public MessageDto LastMessage { get; set; } // Optional: include last message for preview
}