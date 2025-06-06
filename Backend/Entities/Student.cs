namespace Backend.Entities;
public class Student : User
{
    public List<StudentCourse>? StudentCourses { get; set; }
    public List<Payment>? Payments { get; set; }
    public string FirstName { get; set; } = null!;   // <-- must exist
    public string LastName { get; set; } = null!;   // <-- must exist
    public ICollection<StudentAssignment> StudentAssignments { get; set; } = new List<StudentAssignment>();
}