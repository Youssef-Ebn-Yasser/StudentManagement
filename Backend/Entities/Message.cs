namespace Backend.Entities;

public class Message
{
    public int Id { get; set; }
    public string contentEn { get; set; } = string.Empty;
    public string contentAr { get; set; } = string.Empty;
    public int SenderId { get; set; }
    public int? ReceiverId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
    public bool IsReeded { get; set; } = false;
    public int? CourseId { get; set; }


    [ForeignKey("CourseId")]
    public Course? Course { get; set; }


    [ForeignKey("SenderId")]
    public User? Sender { get; set; }


    [ForeignKey("ReceiverId")]
    public User? Receiver { get; set; }
}