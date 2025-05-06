using Backend.DTOs.MessageDTOs;
using Microsoft.AspNetCore.SignalR;

namespace Backend.ChatHubs;

public class ChatHub : Hub
{
    #region    Fields
    private readonly IChatHelper _chatHelper;
    #endregion

    #region    Constructor
    public ChatHub(IChatHelper chatHelper)
    {
        _chatHelper = chatHelper;
    }
    #endregion

    #region    Handle Methods
    public async Task SendMessage(MessageDto message, string groupName)
    {
        // save message
        var result = await _chatHelper.SaveMessage(message);
        if (result < 0) return;

        // send to all subscriber in chat group
        await Clients.Group(groupName).SendAsync("ReceiveMessage", message);
    }
    public async Task JoinGroup(MessageDto message, string groupName)
    {
        // check if in not group add if exist say he is exist
        var result = await _chatHelper.SaveMessage(message);
        if (result < 0) return;

        // send to all subscriber in chat group that new on is join
        await Clients.Group(groupName).SendAsync("NotifyGoinToGroup", message);
    }
    #endregion
}