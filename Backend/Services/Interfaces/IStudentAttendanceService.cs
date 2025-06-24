using Backend.DTOs.StudentDOs;

namespace Backend.Services.Interfaces
{
    public interface IStudentAttendanceService
    {
        Task MarkAttendanceAsync(int meetingId, List<DTOs.StudentDOs.StudentAttendanceDto> attendances);
        Task<Response<List<DTOs.StudentDOs.StudentAttendanceDto>>> GetAttendanceByMeetingAsync(int meetingId);
        Task<Response<List<DTOs.StudentDOs.StudentAttendanceDto>>> GetAttendanceByStudentAsync(int studentId);
    }
}
