namespace Backend.DTOs.LessonDTOs;

public class ShowLessonDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CourseId { get; set; }
} 