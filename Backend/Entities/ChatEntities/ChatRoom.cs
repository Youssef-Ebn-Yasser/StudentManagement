namespace Backend.Entities.ChatEntities;

public class ChatRoom
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }

    public int TeacherId { get; set; }
    public User Teacher { get; set; }

    public int StudentId { get; set; }
    public User Student { get; set; }
    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
}