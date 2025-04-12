namespace Backend.Entities;

public class StudentCourse
{
    [Key] public int Id { get; set; }
    public Course Course { get; set; }
    [ForeignKey(nameof(Course))]
    public int CourseId { get; set; }

    public Student Student { get; set; }
    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }
}