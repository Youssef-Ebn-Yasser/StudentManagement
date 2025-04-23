namespace Backend.DTOs.CourseDTO;

public class ShowAllCoursesDto
{
    public int Id { get; set; }
    public int Title { get; set; }
    public int Description { get; set; }
    public int Price { get; set; }
    public string? ImagePath { get; set; }
}