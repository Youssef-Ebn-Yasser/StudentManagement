namespace Backend.DTOs.AttendanceDTOs;

public class GetAttendencePage
{
    public int courseId { get; set; }
    public int lessionId { get; set; }
    public List<AttendenceDto> AttendenceDtos { get; set; }
}