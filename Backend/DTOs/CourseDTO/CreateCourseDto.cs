namespace Backend.DTOs.CourseDTO;

public class CreateCourseDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double? Price { get; set; }
    public int? TeacherId { get; set; }
    public int? CategoryId { get; set; }
    public IFormFile? Image { get; set; }
}