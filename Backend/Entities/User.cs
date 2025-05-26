namespace Backend.Entities;

public class User : IdentityUser<int>
{
    public string Name { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string UserType { get; private set; }
}