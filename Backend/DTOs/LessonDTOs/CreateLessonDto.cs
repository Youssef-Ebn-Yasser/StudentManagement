namespace Backend.DTOs.LessonDTOs;

public class CreateLessonDto
{
    public int CourseId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
}