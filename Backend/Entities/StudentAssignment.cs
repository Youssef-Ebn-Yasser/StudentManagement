namespace Backend.Entities;

public class StudentAssignment : BaseEntity
{
    public string? Path { get; set; }
    public string? FilePath { get; set; } // Add this property to fix CS0117  
    public Lesson? Lesson { get; set; }
    public int? LessonId { get; set; }
    public Student? Student { get; set; }
    public int StudentId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Degree { get; set; }
}
