namespace Backend.Entities;

public class Course : BaseEntity
{
    public string Description { get; set; } = string.Empty;
    public double Price { get; set; }

    public List<StudentCourse> studentCourses { get; set; }
    public List<Assignment> Assignments { get; set; }
    public List<Material> materials { get; set; }
    public string? ImagePath { get; set; }

}