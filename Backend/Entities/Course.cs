namespace Backend.Entities;

public class Course
{
    [Key] public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public List<StudentCourse> studentCourses { get; set; } = new List<StudentCourse>();
    public List<Assignment> Assignments { get; set; } = new List<Assignment>();
}