namespace Backend.DTOs.ChatDTOs;

public class SendMessageDto
{
    public string Content { get; set; }
    // ChatRoomId will come from the route parameter
}