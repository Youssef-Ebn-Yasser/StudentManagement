namespace Backend.Entities.Meetings;

public class MeetingAttendance
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string MeetingId { get; set; } // matches Meeting.Id (string)
    public bool Attended { get; set; }
    public DateTime AttendanceDate { get; set; } = DateTime.Now;

    // Navigation properties
    [ForeignKey("StudentId")]
    public Student Student { get; set; }

    [ForeignKey("MeetingId")]
    public Meeting Meeting { get; set; }
}