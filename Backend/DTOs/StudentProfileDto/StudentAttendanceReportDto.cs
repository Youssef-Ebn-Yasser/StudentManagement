namespace Backend.DTOs.StudentProfileDto
{
    public class StudentAttendanceReportDto
    {
        public int Id { get; set; }
        public string MeetingTopic { get; set; }
        public DateTime MeetingDate { get; set; }
        public string CourseName { get; set; }
        public bool Attended { get; set; }
        public string MeetingType { get; set; }
    }
}
