namespace Backend.Services.Interfaces;

public interface IPaymentReportingService
{
    public Task<Response<StudentsPaymentPerCourseDto>> GetStudentsPaymentPerCourse(int courseId);
    public Task<Response<List<OrderDto>>> GetPaymentsPerStudents(int userId);
}