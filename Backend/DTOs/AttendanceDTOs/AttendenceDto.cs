namespace Backend.DTOs.AttendanceDTOs;

public class AttendenceDto
{
    public int Id { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string NationalId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public enAttendType? AttendType { get; set; }
    public string Note { get; set; } = string.Empty;
    public bool IsTaken { get; set; }
}