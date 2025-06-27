using Backend.DTOs.StudentDOs;

namespace Backend.Services.Interfaces
{
    public interface IStudentAttendanceService
    {
        public Task<Response<string>> MarkAttendanceAsync(int meetingId, List<DTO.StudentAttendanceDto> attendances);
        public Task<Response<List<DTO.StudentAttendanceDto>>> GetAttendanceByMeetingAsync(int meetingId);
        public Task<Response<List<DTO.StudentAttendanceDto>>> GetAttendanceByStudentAsync(int studentId);
    }
}
