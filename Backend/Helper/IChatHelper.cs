using Backend.DTOs.MessageDTOs;

namespace Backend.Helper;

public interface IChatHelper
{
    public Task<int> SaveMessage(MessageDto message);
    public Task<MessageDto> GetAllMessageInGroup(string groupName);
    public Task<MessageDto> JoinToGroup(int courseId);
    public Task<Response<string>> CreateGroup(string groupName, int courseId);

}