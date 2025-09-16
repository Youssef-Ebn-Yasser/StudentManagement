namespace Backend.DTOs.StudentDOs;

public class CreateStudentDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    [Phone]
    public string Phone { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
    public IFormFile? Image { get; set; }
}