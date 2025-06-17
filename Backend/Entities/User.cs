namespace Backend.Entities;

public class User : IdentityUser<int>
{
    public string NameEn { get; set; }
    public string NameAr { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string UserTypeEn { get; private set; }
    public string UserTypeAr { get; private set; }


    [NotMapped]
    public List<Message>? Messages { get; set; }
}