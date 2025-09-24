namespace Backend.DTOs.Paymob_DTOS;

public class StudentsPaymentPerCourseDto
{

    public StudentsPaymentPerCourseDto()
    {
        CoursePaiedDetails = new();
        AllStudents = new();
    }
    public int NumberOfStudentInthisCourse { get; set; }
    public int NumberOfStudentPaiedForThis { get; set; }

    public List<CoursePaiedDetails> CoursePaiedDetails { get; set; }

    public List<AllStudentsDto> AllStudents { get; set; }
}

public class AllStudentsDto
{
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
}

public class CoursePaiedDetails
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime PaiedAt { get; set; }
    public double CoursePrice { get; set; }
    public double CoursePriceAfterDiscount { get; set; }
    public double? DiscountAmount { get; set; }
}