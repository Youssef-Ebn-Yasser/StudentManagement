using Microsoft.AspNetCore.Identity;

namespace Backend.Entities;

public class User: IdentityUser<int>
{
    // public int Id { get; set; }
    public string? Name { get; set; }
    // public string? Email { get; set; }
    public string? Password { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
