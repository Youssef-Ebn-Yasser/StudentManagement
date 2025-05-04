namespace Backend.Entities;

public class Course : BaseEntity
{
    public string? Description { get; set; }
    public double? Price { get; set; }
    public bool? IsDeleted { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public string? ImagePath { get; set; }
    [Required]
    public string? Level { get; set; }
    public string? Hours { get; set; }
    public List<Lesson>? lessons { get; set; }
    [ForeignKey("TecherId")]
    public Teacher? Teacher { get; set; }
    public int? TecherId { get; set; }
    public List<StudentCourse>? StudentCourses { get; set; }
    [ForeignKey("CategoryId")]
    public int CategoryId { get; set; } // مفتاح أجنبي
    public Category? Category { get; set; }
}