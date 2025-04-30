namespace Backend.DTOs.CourseDTO;

public class ShowAllCoursesDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? Price { get; set; }
    public string? ImagePath { get; set; }
    public string? CategoryName { get; set; }
}