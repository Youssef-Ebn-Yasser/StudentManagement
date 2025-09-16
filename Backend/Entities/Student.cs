namespace Backend.Entities;
public class Student : User
{
    public string? ImageUrl { get; set; }
    public string? Phone { get; set; }
    [Required]
    public string NationalId { get; set; }
    public string? AddressAr { get; set; }
    public string? AddressEn { get; set; }

    public string? GovernmentAr { get; set; }
    public string? GovernmentEn { get; set; }

    public long RandomCode { get; set; } = RandomNumberGenerator();
    public List<StudentCourse>? StudentCourses { get; set; }
    public List<Payment>? Payments { get; set; }
    public List<Comment>? Comments { get; set; }
    public List<StudentAssignment>? StudentAssignments { get; set; }

    public List<MeetingAttendance>? MeetingAttendance { get; set; }
    public static long RandomNumberGenerator()
    {
        Random random = new Random();
        long number = random.Next(100000, 1000000); // First 6 digits
        number = number * 10000 + random.Next(1000, 10000); // Add 4 digits
        return number;
    }

}
