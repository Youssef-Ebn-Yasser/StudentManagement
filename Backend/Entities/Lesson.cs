namespace Backend.Entities;

public class Lesson : BaseEntity
{
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public List<Material>? materials { get; set; }
    [ForeignKey("CourseId")]
    public Course? Course { get; set; }
    public int? CourseId { get; set; }
}
