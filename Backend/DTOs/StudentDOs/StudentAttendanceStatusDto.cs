namespace Backend.DTOs.StudentDOs
{
    public class StudentAttendanceStatusDto
    {
        public int StudentId { get; set; }
        public StudentStatusType Status { get; set; }
        public string? Note { get; set; }
    }
}
