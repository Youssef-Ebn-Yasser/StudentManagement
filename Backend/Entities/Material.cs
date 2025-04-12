namespace Backend.Entities;

public class Material : BaseEntity
{
    public string Content { get; set; } = string.Empty;

    public Course Course { get; set; }
    [ForeignKey(nameof(Course))]
    public int CourseId { get; set; }
}