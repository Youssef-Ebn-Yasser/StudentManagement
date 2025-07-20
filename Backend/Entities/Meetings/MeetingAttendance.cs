namespace Backend.Entities.Meetings;

public class MeetingAttendance
{
    public int Id { get; set; }
    public bool Attended { get; set; }
    public enAttendType? enAttendType { get; set; }
    public bool IsTaken { get; set; } = false;
    public DateTime AttendanceDate { get; set; } = DateTime.Now;
    public string? Note { get; set; }

    public int StudentId { get; set; }
    public int LessionId { get; set; }
    public int CourseId { get; set; }


    // Navigation properties
    [ForeignKey("StudentId")]
    public Student Student { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }

    [ForeignKey("LessionId")]
    public Lesson Lesson { get; set; }
}


public enum enAttendType { Attend = 1, Absent = 2, HalfDay = 3, Sorry = 4 };