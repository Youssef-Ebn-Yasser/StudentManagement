namespace Backend.Entities;

public class StudentCourse
{
    [Key] public int Id { get; set; }
    public Course Course { get; set; } = new Course();
    [ForeignKey(nameof(Course))]
    public string CourseId { get; set; } = string.Empty;

    public Student Student { get; set; } = new Student();
    [ForeignKey(nameof(Student))]
    public string StudentId { get; set; } = string.Empty;
}