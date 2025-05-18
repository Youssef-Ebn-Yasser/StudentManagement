namespace Backend.Entities;

public class Comment : BaseEntity
{
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public bool IsDeleted { get; set; } = false;

    [ForeignKey("StudentId")]
    public Student? Student { get; set; }
    public int? StudentId { get; set; }

    [ForeignKey("LessonId")]
    public Lesson? Lesson { get; set; }
    public int? LessonId { get; set; }

    [ForeignKey("CourseId")]
    public Course? Course { get; set; }
    public int? CourseId { get; set; }
}