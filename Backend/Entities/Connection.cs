namespace Backend.Entities;

public class Connection
{
    public int Id { get; set; }
    public int ConnectionId { get; set; }
    public int UserId { get; set; }


    [ForeignKey("UserId")]
    public User User { get; set; }
}