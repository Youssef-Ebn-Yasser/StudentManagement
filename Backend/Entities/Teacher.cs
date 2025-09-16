namespace Backend.Entities;
public class Teacher : User
{
    public string? AdditionalInfoEn { get; set; }
    public string? AdditionalInfoAr { get; set; }
    public string SpecializationEn { get; set; }
    public string SpecializationAr { get; set; }
    public byte? Age { get; set; }
    public string? ProfileImagePath { get; set; }
    public string? Phone { get; set; }
    public List<Course>? Courses { get; set; }
}