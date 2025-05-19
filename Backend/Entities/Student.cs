namespace Backend.Entities;
public class Student : User
{
    public string? GithubLink { get; set; }
    public string? LinkedInLink { get; set; }
    public string? TelegramLink { get; set; }
    public List<StudentCourse>? StudentCourses { get; set; }
    public List<Payment>? Payments { get; set; }
    public List<Comment>? Comments { get; set; }

}