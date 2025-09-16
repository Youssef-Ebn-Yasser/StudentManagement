using static Backend.Services.Implementation.AttendanceSevice;

namespace Backend.DTOs.AttendanceDTOs;

public class AttendanceSubmition
{
    public int LessionId { get; set; }
    public int CourseId { get; set; }
    public List<StudentAttendanceDto> StudentsAttendanceDto { get; set; }
}