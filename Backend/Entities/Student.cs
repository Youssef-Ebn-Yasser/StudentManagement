namespace Backend.Entities;
public class Student : User
{
    public List<StudentCourse>? StudentCourses { get; set; }
    public List<Payment>? Payments { get; set; }
}