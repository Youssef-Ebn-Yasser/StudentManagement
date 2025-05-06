namespace Backend.Entities;

public class UserChatGroup
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int GroupId { get; set; }


    [ForeignKey("GroupId")]
    public ChatGroup? Group { get; set; }


    [ForeignKey("UserId")]
    public User? User { get; set; }
}