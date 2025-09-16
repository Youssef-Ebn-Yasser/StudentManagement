using static Backend.Services.Implementation.ChatService;

namespace Backend.Services.Interfaces;

public interface IChatService
{
    public Task<Response<List<MessageDto>>> GetChatMessages(int roomId);
    public Task<Response<int>> GetChatRoomID(CreateChatRoomDto dto);
    public Task<Response<List<StudntChatForTeacherDto>>> GetStudentForTeacher(int teacherId);
}