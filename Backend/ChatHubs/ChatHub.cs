using System.Globalization;
using static System.Net.Mime.MediaTypeNames;

namespace Backend.ChatHubs;

public class ChatHub : Hub
{
    #region   Fields
    private readonly ApplicationDbContext _context;
    #endregion

    #region   Constructor
    public ChatHub(ApplicationDbContext context)
    {
        _context = context;
    }
    #endregion

    #region    Methods
    public async Task JoinRoom(int chatRoomId)
    {
        // Add the connection to a group based on chatRoomId
        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId.ToString());
    }
    public async Task SendMessage(int chatRoomId, int senderId, string message)
    {
        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        var chatMessage = new ChatMessage
        {
            //ChatRoomId = chatRoomId,
            //SenderId = senderId,
            //Content = message,
            //Timestamp = DateTime.UtcNow,
            //IsRead = false
        };
        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            chatMessage.ChatRoomId = chatRoomId;
            chatMessage.SenderId = senderId;
            chatMessage.ContentAr = message;
            chatMessage.Timestamp = DateTime.UtcNow;
            chatMessage.IsRead = false;
        }
        else
        {
            chatMessage.ChatRoomId = chatRoomId;
            chatMessage.SenderId = senderId;
            chatMessage.ContentEn = message;
            chatMessage.Timestamp = DateTime.UtcNow;
            chatMessage.IsRead = false;
        }

        _context.ChatMessages.Add(chatMessage);

        // update last message can be good in tracking
        var room = await _context.ChatRooms.FindAsync(chatRoomId);
        if (room != null)
            room.LastMessageAt = chatMessage.Timestamp;

        await _context.SaveChangesAsync();

        await Clients.Group(chatRoomId.ToString()).SendAsync("ReceiveMessage", new
        {
            SenderId = senderId,
            Content = message,
            Timestamp = DateTime.UtcNow
        });
    }
    #endregion
}