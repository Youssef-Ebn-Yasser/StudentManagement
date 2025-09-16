namespace Backend.DTOs.TeacherDTOs;

public class GetTeacherDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public byte? Age { get; set; }
    public string? ProfileImagePath { get; set; }
    public string? AdditionalInfo { get; set; }
    public string? Specialization { get; set; }
}