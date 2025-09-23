namespace Backend.Services.Interfaces;

public interface IPaymentReportingService
{
    public Task<Response<StudentsPaymentPerCourseDto>> GetStudentsPaymentPerCourse(int courseId);
}