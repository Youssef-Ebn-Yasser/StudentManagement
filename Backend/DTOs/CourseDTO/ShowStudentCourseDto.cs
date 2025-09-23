namespace Backend.DTOs.CourseDTO;

public class ShowStudentCourseDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? TeacherName { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
    public string? Level { get; set; }
    public string? Hours { get; set; }
    public string? CategoryName { get; set; }


    public string PaymentMethod { get; set; } = "not paid";
    public bool IsApplyedVoucher { get; set; } = false;
    public decimal? VaoucherValue { get; set; } = 0;

}