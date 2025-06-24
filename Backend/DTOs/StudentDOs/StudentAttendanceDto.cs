namespace Backend.DTOs.StudentDOs
{
    public class StudentAttendanceDto
    {
        public int StudentId { get; set; }
        public StudentStatusType Status { get; set; }
        public string? Note { get; set; }
    }
}
