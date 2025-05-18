namespace Backend.Entities;
public class StudentCourse
{
    public int Id { get; set; }
    [ForeignKey("CourseId")]
    public Course? Course { get; set; }
    public int CourseId { get; set; }
    [ForeignKey("StudentId")]
    public Student? Student { get; set; }
    public int? StudentId { get; set; }
    public DateTime EnrollmentDate { get; set; } = DateTime.Now;
    public bool IsDeleted { get; set; } = false;
}