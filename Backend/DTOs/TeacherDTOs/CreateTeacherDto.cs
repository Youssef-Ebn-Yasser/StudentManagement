namespace Backend.DTOs.TeacherDTOs;

public class CreateTeacherDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public byte? Age { get; set; }
    public IFormFile? Image { get; set; }
    public string? Education { get; set; }
    public string? AdditionalInfo { get; set; }
}