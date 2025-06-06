namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatRoomsController : AppControllerBase
{
    #region   Fields
    private readonly IChatService _chatService;
    #endregion

    #region   Constructor
    public ChatRoomsController(IChatService chatService)
    {
        _chatService = chatService;
    }
    #endregion

    #region   Methods
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
    #endregion
}