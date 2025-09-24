namespace Backend.Services.Interfaces;

public interface IAttendanceSevice
{
    public Task<Response<GetAttendencePage>> GetAttendancePage(int courseId, int lessionId);
    public Task<Response<string>> SubmitAttendancePage(AttendanceSubmition submition);
    public Task<Response<List<FilterAtt>>> FilterAttendance();
    public Task<Response<GetStudentRecoredAttendanceDto>> GetStudentAttendancePerCourse(int studentId, int courseId);
    public Task<Response<GetCourseRecoredAttendanceDto>> GetAttendancePerCourse(int courseId);
    public Task<byte[]?> GenerateAttendanceExcelReportAsync(int studentId, int courseId);
    public Task<byte[]?> GenerateCourseAttendanceExcelReportAsync(int courseId);
}