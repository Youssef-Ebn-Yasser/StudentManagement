namespace Backend.Entities;

public class Student : User
{
    public List<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();
    public List<Payment> Payments { get; set; } = new List<Payment>();
}