namespace Backend.DTOs.AssignmentDTO;

public class StudentAssignmentDetailsDto
{
    public int StudentAssignmentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string LessonName { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public string? Path { get; set; }
    public int DegreePercentage { get; set; }
}