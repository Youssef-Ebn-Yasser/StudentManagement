using Backend.Models.Enums;

namespace Backend.DTOs.CourseDTO;

public class CreateCourseDto
{
    [Required]
    public string Title { get; set; }
    public string? Description { get; set; }
    [Required]
    public double Price { get; set; }
    [Required]
    public int TeacherId { get; set; }
    [Required]
    public int CategoryId { get; set; }
    [Required]
    public string Level { get; set; }
    [Required]
    public string Hours { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public EnCourseType? CourseType { get; set; }
    public IFormFile? Image { get; set; }
}