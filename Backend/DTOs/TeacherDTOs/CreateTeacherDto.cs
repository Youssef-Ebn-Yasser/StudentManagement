namespace Backend.DTOs.TeacherDTOs;

public class CreateTeacherDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public byte? Age { get; set; }
    public string? AdditionalInfo { get; set; }
    public string? Specialization { get; set; }
    public string? Phone { get; set; }
    public string? Password { get; set; }
    public IFormFile? Image { get; set; }
}