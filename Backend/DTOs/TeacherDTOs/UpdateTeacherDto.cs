namespace Backend.DTOs.TeacherDTOs;

public class UpdateTeacherDto
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public byte? Age { get; set; }
    [Required]
    public string Specialization { get; set; }
    [Required]
    [Phone]
    public string? Phone { get; set; }
    public IFormFile? Image { get; set; }
}