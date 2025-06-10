namespace Backend.Entities;

public class StudentAssignment : BaseEntity
{
    public string? Path { get; set; }

    [ForeignKey("LessonId")]
    public Lesson? Lesson { get; set; }
    public int? LessonId { get; set; }
    public byte DegreePercentage { get; set; }

    [ForeignKey("StudentId")]
    public Student? Student { get; set; }
    public int StudentId { get; set; }
}