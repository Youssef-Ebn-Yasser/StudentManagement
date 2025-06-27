namespace Backend.Services.Interfaces
{
    using Backend.DTOs.StudentDOs;
    public interface IStudentAttendanceService
    {
        public Task<Response<string>> MarkAttendanceAsync(int meetingId, List<StudentAttendanceDto> attendances);
        public Task<Response<List<StudentAttendanceDto>>> GetAttendanceByMeetingAsync(int meetingId);
        public Task<Response<List<StudentAttendanceDto>>> GetAttendanceByStudentAsync(int studentId);
    }
}
