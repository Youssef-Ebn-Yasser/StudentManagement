namespace Backend.DTOs.LessonDTOs;

public class CreateLessonDto
{
    public int CourseId { get; set; }
    [Required]
    public string Title { get; set; }
    [Required]
    public string Description { get; set; }
}