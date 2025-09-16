namespace Backend.Services.Interfaces;

public interface IAttendanceSevice
{
    public Task<Response<GetAttendencePage>> GetAttendancePage(int courseId, int lessionId);
    public Task<Response<string>> SubmitAttendancePage(AttendanceSubmition submition);
    public Task<Response<List<FilterAtt>>> FilterAttendance();
}