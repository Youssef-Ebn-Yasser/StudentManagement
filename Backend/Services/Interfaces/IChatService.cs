namespace Backend.Services.Interfaces;

public interface IChatService
{
    public Task<Response<List<MessageDto>>> GetChatMessages(int roomId);
    public Task<Response<int>> GetChatRoomID(CreateChatRoomDto dto);
}