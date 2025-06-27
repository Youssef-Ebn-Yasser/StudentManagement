using Backend.Models.Enums;

namespace Backend.DTO;

public class StudentAttendanceDto
{
    public int StudentId { get; set; }
    public StudentStatusType Status { get; set; }
    public string? Note { get; set; }
}

public enum StudentStatusType
{
    Present,
    Excused,
    Absent,
    HalfDay
}