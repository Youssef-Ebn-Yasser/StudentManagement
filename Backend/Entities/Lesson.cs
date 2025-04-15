namespace Backend.Entities;

public class Lesson : BaseEntity
{
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public List<Material>? materials { get; set; }
    public Course? Course { get; set; }
    [ForeignKey(nameof(Course))]
    public int CourseId { get; set; }
}
