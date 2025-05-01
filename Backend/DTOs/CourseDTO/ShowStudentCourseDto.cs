namespace Backend.DTOs.CourseDTO;

public class ShowStudentCourseDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
    public string? Level { get; set; }
    public string? CategoryName { get; set; }
}