namespace Backend.DTOs.AttendanceDTOs;

public class StudentAttendanceDto
{
    public int StudentId { get; set; }
    public enAttendType AttendType { get; set; }
    public string Note { get; set; } = string.Empty;
}