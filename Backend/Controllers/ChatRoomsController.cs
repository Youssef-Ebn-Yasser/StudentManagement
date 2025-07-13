using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatRoomsController : AppControllerBase
{
    #region   Fields
    private readonly IChatService _chatService;
    private readonly IStructuredLogger _logger;
    #endregion

    #region   Constructor
    public ChatRoomsController(IChatService chatService, IStructuredLogger logger)
    {
        _chatService = chatService;
        _logger = logger;
    }
    #endregion

    #region   Methods
    [Authorize(Roles = "Student,Teacher")]
    [HttpPost("GetChatRoomID")]
    public async Task<ActionResult<ChatRoomDto>> GetChatRoomID(CreateChatRoomDto createDto)
    {
        try
        {
            var result = await _chatService.GetChatRoomID(createDto);
            return NewResult(result);
        }
        catch
        {
            return BadRequest("error happen");
        }
    }
    [Authorize(Roles = "Student,Teacher")]
    [HttpGet("{id}/messages")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetChatMessages(int id)
    {
        try
        {
            var result = await _chatService.GetChatMessages(id);
            return NewResult(result);
        }
        catch
        {
            return BadRequest("error happen");
        }
    }
    [Authorize(Roles = "Student,Teacher")]
    [HttpGet("student/EnroolWithTeacher")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> StudentWithTeacher(int id)
    {
        try
        {
            var result = await _chatService.GetStudentForTeacher(id);
            return NewResult(result);
        }
        catch
        {
            return BadRequest("error happen");
        }
    }
    #endregion
}