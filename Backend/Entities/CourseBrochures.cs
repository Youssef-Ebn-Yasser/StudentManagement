namespace Backend.Entities;

public class CourseBrochures
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string Link { get; set; } = string.Empty;
    public int? CourseId { get; set; }

    [ForeignKey("CourseId")]
    public Course? Course { get; set; }

    public bool IsDeleted { get; set; } = false;
}