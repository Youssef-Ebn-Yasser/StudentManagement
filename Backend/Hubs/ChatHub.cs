using Backend.Context;
using Backend.DTOs.ChatDTOs;
using Backend.Entities.ChatEntities;
using Microsoft.AspNetCore.SignalR;
using MimeKit;
using System.Globalization;
using System.Security.Claims;
using System.Threading;
using static System.Net.Mime.MediaTypeNames;

namespace Backend.Hubs;


public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;

    public ChatHub(ApplicationDbContext context)
    {
        _context = context;
    }



    // Mapping between user IDs and connection IDs
    private static readonly Dictionary<string, string> _userConnections = new();

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;

        if (!string.IsNullOrEmpty(userId))
        {
            _userConnections[userId] = Context.ConnectionId;
        }

        await base.OnConnectedAsync();
    }

    public async Task SendMessage(string toUserId, string message)
    {
        var fromUserId = Context.UserIdentifier;

        // Save to DB
        await SaveMessageToDatabase(fromUserId, toUserId, message);

        if (_userConnections.TryGetValue(toUserId, out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", fromUserId, message);
        }

        // Optional: echo to sender too
        await Clients.Caller.SendAsync("ReceiveMessage", toUserId, message);
    }

    private Task SaveMessageToDatabase(string fromUserId, string toUserId, string message)
    {
        // Save to DB here (EF Core or Dapper)
        return Task.CompletedTask;
    }




    // Method for users to join a specific chat room group
    // This is crucial for sending messages only to participants of a room.
    public async Task JoinRoom(int chatRoomId)
    {
        //var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        //if (string.IsNullOrEmpty(userId))
        //{
        //    // Optionally disconnect or log error
        //    throw new HubException("User is not authenticated.");
        //}

        var chatRoom = await _context.ChatRooms
            .Include(cr => cr.Teacher)
            .Include(cr => cr.Student)
            .FirstOrDefaultAsync(cr => cr.Id == chatRoomId);

        if (chatRoom == null)
        {
            throw new HubException($"Chat room {chatRoomId} not found.");
        }

        //// Ensure the user is a participant of this chat room
        //if (chatRoom.TeacherId.ToString() != userId && chatRoom.StudentId.ToString() != userId)
        //{
        //    throw new HubException("You are not authorized to join this chat room.");
        //}

        // Add the connection to the SignalR group for this chat room
        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId.ToString());
        // Console.WriteLine($"User {userId} joined room {chatRoomId} (ConnectionId: {Context.ConnectionId})");
    }
    public async Task SendMessageToRoom(int chatRoomId, int senderId, string messageContent)
    {

        var chatRoom = await _context.ChatRooms
            .Include(cr => cr.Teacher)
            .Include(cr => cr.Student)
            .FirstOrDefaultAsync(cr => cr.Id == chatRoomId);

        if (chatRoom == null)
        {
            throw new HubException($"Chat room {chatRoomId} not found.");
        }

        // Create and save the message to the database
        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
        var chatMessage = new ChatMessage { 
        //{
        //    ChatRoomId = chatRoomId,
        //    SenderId = senderId,
        //    Content = messageContent,
        //    Timestamp = DateTime.UtcNow,
        //    IsRead = false // Set to false initially
        };
        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            chatMessage.ChatRoomId = chatRoomId;
            chatMessage.SenderId = senderId;
            chatMessage.ContentAr = messageContent;
            chatMessage.Timestamp = DateTime.UtcNow;
            chatMessage.IsRead = false; // Set to false initially
        }
        else
        {
            chatMessage.ChatRoomId = chatRoomId;
            chatMessage.SenderId = senderId;
            chatMessage.ContentEn = messageContent;
            chatMessage.Timestamp = DateTime.UtcNow;
            chatMessage.IsRead = false; // Set to false initially
        }

        _context.ChatMessages.Add(chatMessage);

        // Update LastMessageAt for the chat room
        chatRoom.LastMessageAt = chatMessage.Timestamp;
        _context.ChatRooms.Update(chatRoom);

        await _context.SaveChangesAsync();

        // Get sender's display name
        var sender = await _context.Users.FindAsync(senderId);
        var senderName = sender?.UserName ?? "Unknown User"; // Or use a custom display name property

        // Create DTO for broadcasting
        var messageDto = new MessageDto
        {
            Id = chatMessage.Id,
            ChatRoomId = chatMessage.ChatRoomId,
            SenderId = chatMessage.SenderId,
            SenderName = senderName,
            Content = GeneralLocalizableEntity.Localized(chatMessage.ContentAr, chatMessage.ContentEn),
            Timestamp = chatMessage.Timestamp
        };

        // Broadcast the message to all clients in the specific chat room group
        // The client-side method will be "ReceiveMessage"
        await Clients.Group(chatRoomId.ToString()).SendAsync("ReceiveMessage", messageDto);
        await Clients.All.SendAsync("ReceiveMessage", messageDto);

    }

    // Optional: Handle user disconnection
    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        Console.WriteLine($"User {userId} disconnected. ConnectionId: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }
}
