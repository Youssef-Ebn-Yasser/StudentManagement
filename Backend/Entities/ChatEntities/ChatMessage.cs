namespace Backend.Entities.ChatEntities;

public class ChatMessage
{
    public int Id { get; set; }
    public string ContentEn { get; set; }
    public string ContentAr { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; } = false;


    public int ChatRoomId { get; set; }
    public ChatRoom ChatRoom { get; set; }


    public int SenderId { get; set; }
    public User Sender { get; set; }
}