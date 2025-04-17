using System.Runtime.CompilerServices;
namespace Backend.Entities;
public class Teacher : User
{
    public string? Education { get; set; } 
    public string? AdditionalInfo { get; set; } 
    public string? Experience { get; set; } 
    public string? Specialization { get; set; } 
    public string? CVPath { get; set; } 
    public List<Course> Courses { get; set; } = new List<Course>();
}