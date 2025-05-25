namespace Backend.DTOs.StudentDOs;

public class ShowStudentDto
{
    public string? ImageUrl { get; set; }
    public string? Phone { get; set; }
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}