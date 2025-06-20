namespace Backend.DTOs.TeacherDTOs;

public class UpdateTeacherDto
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public byte? Age { get; set; }
    public string? Specialization { get; set; }
    public string? AdditionalInfo { get; set; }
    [Required]
    [Phone]
    public string? Phone { get; set; }
    public IFormFile? Image { get; set; }
}