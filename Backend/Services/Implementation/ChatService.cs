namespace Backend.Services.Implementation;

public class ChatService : ResponseHandler, IChatService
{
    #region   Fields
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    #endregion

    #region    Constructor
    public ChatService(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    #endregion

    #region   Methods
    public async Task<Response<List<MessageDto>>> GetChatMessages(int roomId)
    {
        var chatRoom = await _context.ChatRooms
            .AsNoTracking()
            .FirstOrDefaultAsync(cr => cr.Id == roomId);

        if (chatRoom == null)
            return BadRequest<List<MessageDto>>($"Chat room with ID {roomId} not found or you are not a participant.");

        var messages = await _context.ChatMessages
            .Where(cm => cm.ChatRoomId == roomId)
            .Include(cm => cm.Sender)
            .OrderBy(cm => cm.Timestamp)
            .Select(cm => new MessageDto
            {
                Id = cm.Id,
                ChatRoomId = cm.ChatRoomId,
                SenderId = cm.SenderId,
                SenderName = cm.Sender.UserName!,
                Content = cm.Content,
                Timestamp = cm.Timestamp
            })
            .ToListAsync();

        var unreadMessages = _context.ChatMessages
            .Where(cm => cm.ChatRoomId == roomId && !cm.IsRead);
        foreach (var msg in unreadMessages)
        {
            msg.IsRead = true;
        }
        await _context.SaveChangesAsync();

        return Success(messages);
    }

    public async Task<Response<int>> GetChatRoomID(CreateChatRoomDto createDto)
    {
        if (string.IsNullOrEmpty(createDto.StudentId) || string.IsNullOrEmpty(createDto.TeacherId))
            return BadRequest<int>("Both StudentId and TeacherId must be provided to create a chat room.");


        var studentUser = await _userManager.FindByIdAsync(createDto.StudentId);
        var teacherUser = await _userManager.FindByIdAsync(createDto.TeacherId);

        if (studentUser == null)
            return BadRequest<int>($"Student with ID '{createDto.StudentId}' not found.");

        if (teacherUser == null)
            return BadRequest<int>($"Teacher with ID '{createDto.TeacherId}' not found.");


        var isStudentInRole = await _userManager.IsInRoleAsync(studentUser, "Student");
        var isTeacherInRole = await _userManager.IsInRoleAsync(teacherUser, "Teacher");

        if (!isStudentInRole || !isTeacherInRole)
            return BadRequest<int>("One of the specified users is not in the correct role (Student/Teacher).");


        var existingRoom = await _context.ChatRooms
            .AsNoTracking()
        .FirstOrDefaultAsync(cr =>
        (cr.TeacherId.ToString() == createDto.TeacherId && cr.StudentId.ToString() == createDto.StudentId));


        if (existingRoom != null)
            return Success(existingRoom.Id);


        var newChatRoom = new ChatRoom
        {
            TeacherId = int.Parse(createDto.TeacherId),
            StudentId = int.Parse(createDto.StudentId),
            CreatedAt = DateTime.UtcNow
        };

        _context.ChatRooms.Add(newChatRoom);
        await _context.SaveChangesAsync();

        return Success(newChatRoom.Id);
    }
    #endregion
}