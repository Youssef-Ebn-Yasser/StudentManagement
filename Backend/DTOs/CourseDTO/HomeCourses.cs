namespace Backend.DTOs.CourseDTO;

public class HomeCourses
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Level { get; set; }
    public double? Price { get; set; }
    public string? Hours { get; set; }
    public string? ImagePath { get; set; }
    public string? CategoryName { get; set; }
    public string? TeacherName { get; set; }

}