namespace Backend.Entities;

public class BaseEntity
{
    [Key] public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
}