namespace Backend.DTOs.AssignmentDTO;

public class UploadAssignmentDto
{
    public IFormFile File { get; set; }
    public int StudentId { get; set; }
    public int LessonId { get; set; }
}