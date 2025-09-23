namespace Backend.Entities;

public class User : IdentityUser<int>
{
    public string? NameAr { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string? NameEn { get; set; }
    public string UserType { get; set; }
    public string? education { get; set; }
    public int? Age { get; set; }
    [NotMapped]
    public List<Message>? Messages { get; set; }
}