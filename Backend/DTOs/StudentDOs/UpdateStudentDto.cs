namespace Backend.DTOs.StudentDOs;

public class UpdateStudentDto
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    [Phone]
    public string Phone { get; set; }
    public string? education { get; set; }
    public int? Age { get; set; }
    public IFormFile? Image { get; set; }
}