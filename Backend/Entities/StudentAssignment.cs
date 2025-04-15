namespace Backend.Entities;

public class StudentAssignment : BaseEntity
{
    public string? Path { get; set; }

    public Lesson? Lesson { get; set; }
    [ForeignKey(nameof(Lesson))]
    public int LessonId { get; set; }

    public Student? Student { get; set; }
    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }
}
