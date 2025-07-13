namespace Backend.Services.Interfaces
{
    using Backend.DTOs.StudentDOs;
    public interface IStudentAttendanceService
    {
        public Task<Response<string>> MarkAttendanceAsync(int meetingId, List<StudentAttendanceStatusDto> attendances);
        public Task<Response<List<StudentAttendanceStatusDto>>> GetAttendanceByMeetingAsync(int meetingId);
        public Task<Response<List<StudentAttendanceStatusDto>>> GetAttendanceByStudentAsync(int studentId);
    }
}
