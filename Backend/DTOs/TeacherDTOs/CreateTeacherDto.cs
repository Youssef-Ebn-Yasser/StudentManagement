namespace Backend.DTOs.TeacherDTOs;

public class CreateTeacherDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    public byte? Age { get; set; }
    [Required]
    public string Specialization { get; set; }
    [Required]
    [Phone]
    public string? Phone { get; set; }
    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
    public IFormFile? Image { get; set; }
}