namespace Backend.Entities;
public class Teacher : User
{
    public string? AdditionalInfo { get; set; }
    public string? Specialization { get; set; }
    public byte Age { get; set; }
    public string? ProfileImagePath { get; set; }
    public string? Phone { get; set; }
    public List<Course>? Courses { get; set; }
}