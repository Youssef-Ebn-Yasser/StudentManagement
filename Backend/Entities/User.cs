namespace Backend.Entities;
public class User
{
    [Key]
    public int Id { get; set; }
    public string? Name { get; set; }
    public byte Age { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Password { get; set; }
    public bool IsDeleted { get; set; } = false;
    public string? ProfileImagePath { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}