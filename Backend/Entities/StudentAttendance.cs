namespace Backend.Entities;

public class StudentAttendance
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int MeetingId { get; set; }
    public StudentStatusType Status { get; set; }
    public string? Note { get; set; }
    public DateTime Date { get; set; }
    [ForeignKey("StudentId")]
    public Student Student { get; set; }
    public Meeting Meeting { get; set; }
}
public enum StudentStatusType
{
    Present,
    Excused,
    Absent,
    HalfDay
}