namespace Backend.Entities;
public class Student : User
{
    public string? ImageUrl { get; set; }
    public string? Phone { get; set; }
    public List<StudentCourse>? StudentCourses { get; set; }
    public List<Payment>? Payments { get; set; }
    public List<Comment>? Comments { get; set; }
    public List<StudentAssignment>? StudentAssignments { get; set; }


}