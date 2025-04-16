namespace Backend.Entities;

public class Course : BaseEntity
{
    public string? Description { get; set; } 
    public double Price { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string? ImagePath { get; set; }
    public List<Lesson>? lessons { get; set; }
    public Teacher? Teacher { get; set; }
    public int TecherId { get; set; }
}